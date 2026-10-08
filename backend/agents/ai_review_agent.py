import os
import json
import time

from dotenv import load_dotenv
from google import genai
from google.genai import types


# =========================================================
# ENVIRONMENT SETUP
# =========================================================

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=API_KEY)


# =========================================================
# RESPONSE SCHEMA
# Forces Gemini to return the structure we need
# =========================================================

candidate_schema = {
    "type": "object",
    "properties": {

        "candidate_id": {
            "type": "integer"
        },

        "name": {
            "type": "string"
        },

        "focus": {
            "type": "string"
        },

        "description": {
            "type": "string"
        },

        "optimized_code": {
            "type": "string"
        },

        "estimated_scores": {
            "type": "object",

            "properties": {

                "readability": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 100
                },

                "maintainability": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 100
                },

                "performance": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 100
                },

                "reliability": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 100
                },

                "security": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 100
                }
            },

            "required": [
                "readability",
                "maintainability",
                "performance",
                "reliability",
                "security"
            ]
        },

        "time_complexity": {
            "type": "string"
        }
    },

    "required": [
        "candidate_id",
        "name",
        "focus",
        "description",
        "optimized_code",
        "estimated_scores",
        "time_complexity"
    ]
}


review_schema = {
    "type": "object",

    "properties": {

        "summary": {
            "type": "string"
        },

        "candidates": {
            "type": "array",

            "items": candidate_schema,

            "minItems": 4,
            "maxItems": 4
        }
    },

    "required": [
        "summary",
        "candidates"
    ]
}


# =========================================================
# AI REVIEW AGENT
# =========================================================

def run_ai_review(
    code,
    static_analysis,
    security_analysis
):

    """
    Agent 03 - AI Review Agent

    Receives:
    1. Original source code
    2. Static Analysis results from Pylint
    3. Security Analysis results from Bandit

    Generates:
    Exactly four optimized candidate programs.
    """


    # =====================================================
    # CHECK API KEY
    # =====================================================

    if not API_KEY:

        return {
            "success": False,
            "error": "GEMINI_API_KEY is not configured.",
            "summary": "",
            "candidates": []
        }


    # =====================================================
    # PROMPT
    # =====================================================

    prompt = f"""
You are Agent 03, the AI Review Agent inside a
Multi-Agentic AI Code Review System.

You receive:

1. Original Python source code
2. Static Analysis findings produced by Pylint
3. Security Analysis findings produced by Bandit

Your responsibility is to generate EXACTLY FOUR
complete improved versions of the original program.

Do not simply explain the problems.

Generate real optimized Python code.


================ ORIGINAL CODE ================

{code}


================ STATIC ANALYSIS ================

{json.dumps(static_analysis, indent=2)}


================ SECURITY ANALYSIS ================

{json.dumps(security_analysis, indent=2)}


================ CANDIDATE 1 =================

Name:
Security Focused

Focus:
Security

Requirements:

- Fix relevant Bandit vulnerabilities.
- Remove or replace dangerous operations.
- Avoid unsafe subprocess usage.
- Avoid unsafe eval/exec when applicable.
- Avoid hardcoded credentials where applicable.
- Preserve the intended program functionality.


================ CANDIDATE 2 =================

Name:
Readability and Maintainability Focused

Focus:
Readability and Maintainability

Requirements:

- Improve variable and function names.
- Improve formatting.
- Improve program structure.
- Add useful documentation where appropriate.
- Reduce Pylint problems.
- Improve modularity.
- Make the code easier to understand and maintain.


================ CANDIDATE 3 =================

Name:
Performance and Reliability Focused

Focus:
Performance and Reliability

Requirements:

- Improve efficiency where meaningful.
- Improve resource handling.
- Improve exception handling.
- Improve robustness.
- Avoid unnecessary operations.
- Preserve program behavior.


================ CANDIDATE 4 =================

Name:
Balanced Optimization

Focus:
Overall Quality

Requirements:

Combine the strongest improvements from the previous
approaches.

Optimize for:

- Security
- Readability
- Maintainability
- Performance
- Reliability
- Python best practices


================ IMPORTANT RULES ================

Generate EXACTLY four candidates.

candidate_id values must be:

1
2
3
4

Every optimized_code value must contain complete
Python source code.

Do NOT use markdown code fences inside optimized_code.

Do NOT include ```python or ```.

Do not intentionally introduce new vulnerabilities.

Preserve the intended functionality of the original
program as much as reasonably possible.

Give each candidate estimated scores from 0 to 100 for:

- readability
- maintainability
- performance
- reliability
- security

Also provide a short Big-O time complexity description
for every candidate.
"""


    # =====================================================
    # GEMINI REQUEST
    # =====================================================

    try:

        response = client.models.generate_content(
            model="gemini-flash-lite-latest",

            contents=prompt,

            config=types.GenerateContentConfig(

                response_mime_type="application/json",

                response_json_schema=review_schema,

                
            )
        )


        # =================================================
        # CHECK RESPONSE
        # =================================================

        if not response.text:

            raise ValueError(
                "Gemini returned an empty response."
            )


        # =================================================
        # PARSE JSON
        # =================================================

        result = json.loads(
            response.text
        )


        candidates = result.get(
            "candidates",
            []
        )


        # =================================================
        # VALIDATE NUMBER OF CANDIDATES
        # =================================================

        if len(candidates) != 4:

            raise ValueError(
                "AI Review Agent did not generate exactly 4 candidates."
            )


        # =================================================
        # VALIDATE CANDIDATES
        # =================================================

        for index, candidate in enumerate(
            candidates,
            start=1
        ):

            candidate["candidate_id"] = index


            if not candidate.get(
                "optimized_code"
            ):

                raise ValueError(
                    f"Candidate {index} does not contain optimized code."
                )


        # =================================================
        # SUCCESS
        # =================================================

        result["success"] = True

        return result


    # =====================================================
    # INVALID JSON
    # =====================================================

    except json.JSONDecodeError as error:

        return {

            "success": False,

            "error":
                f"Gemini returned invalid JSON: {str(error)}",

            "summary": "",

            "candidates": []
        }


    # =====================================================
    # OTHER ERRORS
    # =====================================================

    except Exception as error:

        return {

            "success": False,

            "error": str(error),

            "summary": "",

            "candidates": []
        }