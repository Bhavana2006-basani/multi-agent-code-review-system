import json
import os
import subprocess
import tempfile


def run_static_analysis(code):
    temp_file_path = None

    try:
        # Create temporary Python file
        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".py",
            delete=False,
            encoding="utf-8"
        ) as temp_file:

            temp_file.write(code)
            temp_file_path = temp_file.name

        # Run Pylint and request JSON output
        result = subprocess.run(
            [
                "pylint",
                temp_file_path,
                "--output-format=json"
            ],
            capture_output=True,
            text=True
        )

        # Convert Pylint JSON output into Python list
        findings = json.loads(result.stdout) if result.stdout.strip() else []

        # Counters
        errors = 0
        warnings = 0
        refactor = 0
        convention = 0
        fatal = 0

        formatted_findings = []

        for issue in findings:

            issue_type = issue.get("type", "")

            if issue_type == "error":
                errors += 1

            elif issue_type == "warning":
                warnings += 1

            elif issue_type == "refactor":
                refactor += 1

            elif issue_type == "convention":
                convention += 1

            elif issue_type == "fatal":
                fatal += 1

            formatted_findings.append({
                "type": issue_type,
                "message": issue.get("message"),
                "message_id": issue.get("message-id"),
                "symbol": issue.get("symbol"),
                "line": issue.get("line"),
                "column": issue.get("column")
            })

        total_findings = len(formatted_findings)

        return {
            "success": True,

            "summary": {
                "total_findings": total_findings,
                "errors": errors,
                "warnings": warnings,
                "refactor": refactor,
                "convention": convention,
                "fatal": fatal
            },

            "findings": formatted_findings
        }

    except Exception as error:

        return {
            "success": False,
            "error": str(error)
        }

    finally:

        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)