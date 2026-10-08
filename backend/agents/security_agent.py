import json
import os
import subprocess
import tempfile


def run_security_analysis(code):
    temp_file_path = None

    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".py",
            delete=False,
            encoding="utf-8"
        ) as temp_file:
            temp_file.write(code)
            temp_file_path = temp_file.name

        result = subprocess.run(
            [
                "bandit",
                "-f",
                "json",
                temp_file_path
            ],
            capture_output=True,
            text=True
        )

        if not result.stdout.strip():
            return {
                "success": False,
                "error": result.stderr or "Bandit returned no output"
            }

        bandit_data = json.loads(result.stdout)

        results = bandit_data.get("results", [])

        high = 0
        medium = 0
        low = 0

        findings = []

        for issue in results:
            severity = issue.get("issue_severity", "LOW").upper()

            if severity == "HIGH":
                high += 1
            elif severity == "MEDIUM":
                medium += 1
            elif severity == "LOW":
                low += 1

            findings.append({
                "test_id": issue.get("test_id"),
                "test_name": issue.get("test_name"),
                "severity": severity,
                "confidence": issue.get("issue_confidence"),
                "message": issue.get("issue_text"),
                "line": issue.get("line_number")
            })

        return {
            "success": True,
            "summary": {
                "total_findings": len(findings),
                "high": high,
                "medium": medium,
                "low": low
            },
            "findings": findings
        }

    except Exception as error:
        return {
            "success": False,
            "error": str(error)
        }

    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)