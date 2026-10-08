import {
  AlertTriangle,
  ShieldAlert,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

function SuggestionsPanel() {
  return (
    <div className="analysis-details">

      {/* DETECTED ISSUES */}

      <div className="issues-panel">

        <div className="panel-title">
          <ShieldAlert size={22} />
          <h2>Detected Issues</h2>
        </div>

        <div className="issue-item">
          <span className="severity critical">CRITICAL</span>

          <div>
            <h4>Hardcoded Credentials</h4>
            <p>
              Password or sensitive credential detected directly
              inside the source code.
            </p>
          </div>
        </div>

        <div className="issue-item">
          <span className="severity high">HIGH</span>

          <div>
            <h4>Unsafe System Command</h4>
            <p>
              Use of system commands may introduce security risks.
            </p>
          </div>
        </div>

        <div className="issue-item">
          <span className="severity medium">MEDIUM</span>

          <div>
            <h4>Unused Variables</h4>
            <p>
              Unused variables reduce code quality and maintainability.
            </p>
          </div>
        </div>

        <div className="issue-item">
          <span className="severity low">LOW</span>

          <div>
            <h4>Code Quality Improvement</h4>
            <p>
              Some sections can be simplified for better readability.
            </p>
          </div>
        </div>

      </div>


      {/* AI SUGGESTIONS */}

      <div className="suggestions-panel">

        <div className="panel-title">
          <Lightbulb size={22} />
          <h2>AI Suggestions</h2>
        </div>

        <div className="suggestion">
          <CheckCircle2 size={19} />
          <p>
            Store passwords and API keys using environment variables.
          </p>
        </div>

        <div className="suggestion">
          <CheckCircle2 size={19} />
          <p>
            Remove unused imports and variables.
          </p>
        </div>

        <div className="suggestion">
          <CheckCircle2 size={19} />
          <p>
            Replace unsafe system commands with safer alternatives.
          </p>
        </div>

        <div className="suggestion">
          <CheckCircle2 size={19} />
          <p>
            Use proper exception handling for error-prone operations.
          </p>
        </div>

        <div className="suggestion">
          <CheckCircle2 size={19} />
          <p>
            Use context managers when opening and writing files.
          </p>
        </div>

        <div className="ai-summary">

          <AlertTriangle size={21} />

          <div>
            <h4>AI Review Summary</h4>

            <p>
              The code requires security improvements before it
              should be considered production ready.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default SuggestionsPanel;