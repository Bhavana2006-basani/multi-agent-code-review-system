from flask import Flask, jsonify, request
from flask_cors import CORS

from agents.static_agent import run_static_analysis
from agents.security_agent import run_security_analysis
from agents.ai_review_agent import run_ai_review
from agents.decision_agent import run_decision_agent


app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Multi-Agentic AI Code Review Backend Running"
    })


@app.route("/api/analyze", methods=["POST"])
def analyze_code():

    try:

        # =========================
        # GET REQUEST DATA
        # =========================

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "error": "Request body is required"
            }), 400


        code = data.get("code", "")
        language = data.get("language", "Python")


        # =========================
        # VALIDATION
        # =========================

        if not code.strip():
            return jsonify({
                "success": False,
                "error": "Source code is required"
            }), 400


        if language.lower() != "python":
            return jsonify({
                "success": False,
                "error": "Currently only Python analysis is supported"
            }), 400


        # =================================================
        # AGENT 01
        # STATIC ANALYSIS - PYLINT
        # =================================================

        static_result = run_static_analysis(code)


        # =================================================
        # AGENT 02
        # SECURITY ANALYSIS - BANDIT
        # =================================================

        security_result = run_security_analysis(code)


        # =================================================
        # AGENT 03
        # AI REVIEW AGENT - GEMINI
        #
        # Generates 4 optimized code candidates
        # =================================================

        ai_review_result = run_ai_review(
            code,
            static_result,
            security_result
        )


        # =================================================
        # AGENT 04
        # DECISION AGENT
        #
        # Compares the 4 optimized candidates
        # and selects the best one
        # =================================================

        decision_result = run_decision_agent(
            ai_review_result
        )


        # =================================================
        # FINAL MULTI-AGENT RESPONSE
        # =================================================

        return jsonify({

            "success": True,

            "language": language,

            "static_analysis": static_result,

            "security_analysis": security_result,

            "ai_review": ai_review_result,

            "decision": decision_result

        })


    except Exception as error:

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500


if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )