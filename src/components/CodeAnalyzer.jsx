import { useState } from "react";

import Header from "./Header";
import CodeEditor from "./CodeEditor";
import Pipeline from "./Pipeline";
import ResultCard from "./ResultCard";


function CodeAnalyzer({ analysisData, setAnalysisData }) {

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");

  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentStage, setCurrentStage] = useState("idle");
  const [error, setError] = useState("");

  // Candidate code visibility
  const [visibleCandidate, setVisibleCandidate] = useState(null);

  // Final optimized code visibility
  const [showFinalCode, setShowFinalCode] = useState(false);


  // =====================================================
  // FILE UPLOAD
  // =====================================================

  const handleFileUpload = (event) => {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {

      setCode(e.target.result);

      setShowResults(false);
      setAnalysisData(null);
      setError("");
      setCurrentStage("idle");

      setVisibleCandidate(null);
      setShowFinalCode(false);
    };

    reader.readAsText(file);
  };


  // =====================================================
  // REAL BACKEND ANALYSIS
  // =====================================================

  const handleAnalyze = async () => {

    if (!code.trim()) {

      alert("Please paste or upload source code first.");

      return;
    }


    if (language !== "Python") {

      alert(
        "Static Analysis, Security Analysis, AI Review and Decision Agent currently support Python only."
      );

      return;
    }


    try {

      setLoading(true);

      setShowResults(false);

      setAnalysisData(null);

      setError("");

      setVisibleCandidate(null);

      setShowFinalCode(false);

      setCurrentStage("analysis");


      // =================================================
      // CALL FLASK BACKEND
      // =================================================

      const response = await fetch(
        "http://127.0.0.1:5000/api/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            code: code,
            language: language,
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.error || "Code analysis failed."
        );
      }


      if (!data.success) {

        throw new Error(
          data.error || "Backend analysis failed."
        );
      }


      // =================================================
      // STORE COMPLETE MULTI-AGENT RESPONSE
      // =================================================

      setAnalysisData(data);

      setCurrentStage("completed");

      setShowResults(true);

    }

    catch (err) {

      console.error(
        "Analysis Error:",
        err
      );

      setError(err.message);

      setCurrentStage("idle");

    }

    finally {

      setLoading(false);

    }
  };


  // =====================================================
  // STATIC ANALYSIS VALUES
  // =====================================================

  const staticSummary =
    analysisData?.static_analysis?.summary;

  const staticTotal =
    staticSummary?.total_findings ?? 0;

  const warnings =
    staticSummary?.warnings ?? 0;

  const errors =
    staticSummary?.errors ?? 0;

  const refactor =
    staticSummary?.refactor ?? 0;

  const convention =
    staticSummary?.convention ?? 0;


  // =====================================================
  // SECURITY ANALYSIS VALUES
  // =====================================================

  const securitySummary =
    analysisData?.security_analysis?.summary;

  const securityTotal =
    securitySummary?.total_findings ?? 0;

  const highRisk =
    securitySummary?.high ?? 0;

  const mediumRisk =
    securitySummary?.medium ?? 0;

  const lowRisk =
    securitySummary?.low ?? 0;


  // =====================================================
  // AGENT 03 — AI REVIEW VALUES
  // =====================================================

  const aiReview =
    analysisData?.ai_review;

  const aiSuccess =
    aiReview?.success === true;

  const candidates =
    Array.isArray(aiReview?.candidates)
      ? aiReview.candidates
      : [];


  // =====================================================
  // AGENT 04 — DECISION VALUES
  // =====================================================

  const decision =
    analysisData?.decision;

  const decisionSuccess =
    decision?.success === true;

  const selectedScores =
    decision?.selected_scores || {};


  // =====================================================
  // DERIVED STATIC + SECURITY SCORES
  // =====================================================

  const codeQualityScore = Math.max(
    0,
    100 -
      errors * 15 -
      warnings * 5 -
      refactor * 3 -
      convention * 2
  );


  const securityScore = Math.max(
    0,
    100 -
      highRisk * 20 -
      mediumRisk * 10 -
      lowRisk * 5
  );


  // =====================================================
  // TOGGLE CANDIDATE CODE
  // =====================================================

  const toggleCandidateCode = (candidateId) => {

    if (visibleCandidate === candidateId) {

      setVisibleCandidate(null);

    } else {

      setVisibleCandidate(candidateId);

    }
  };


  return (

    <div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header
        title="Agentic Code Analyzer"
        subtitle="Multi-agent source code quality, security, AI optimization and decision analysis"
      />


      <div className="analyzer-container">


        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="editor-section">


          {/* =================================================
              EDITOR HEADER
          ================================================= */}

          <div className="editor-header">

            <div>

              <h2>
                Source Code
              </h2>

              <p className="editor-subtitle">
                Submit code to the multi-agent analysis system
              </p>

            </div>


            <div className="toolbar">

              <select
                className="language-select"
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value)
                }
              >

                <option>Python</option>
                <option>Java</option>
                <option>JavaScript</option>
                <option>C</option>
                <option>C++</option>

              </select>


              <label className="upload-btn">

                Upload File

                <input
                  type="file"
                  accept=".py,.java,.js,.cpp,.c"
                  hidden
                  onChange={handleFileUpload}
                />

              </label>

            </div>

          </div>


          {/* =================================================
              CODE EDITOR
          ================================================= */}

          <CodeEditor
            code={code}
            setCode={setCode}
          />


          {/* =================================================
              ANALYZE BUTTON
          ================================================= */}

          <button
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={loading}
          >

            {loading
              ? "⚡ Agents Working..."
              : "🚀 Start Agentic Analysis"}

          </button>


          {/* =================================================
              LIVE ANALYSIS STATUS
          ================================================= */}

          {loading && (

            <div className="analysis-loading">

              <div className="spinner"></div>

              <h3>
                Multi-Agent Analysis Running
              </h3>

              <p>
                🔍 Static Analysis, 🛡️ Security Analysis,
                🤖 AI Review and 🧠 Decision Agents are
                processing your source code...
              </p>

              <small>
                Pylint + Bandit + Gemini AI + Decision Engine
              </small>

            </div>

          )}


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="analysis-error">

              <h3>
                Analysis Failed
              </h3>

              <p>
                {error}
              </p>

              <small>
                Make sure the Flask backend is running on port 5000.
              </small>

            </div>

          )}


          {/* =================================================
              REAL MULTI-AGENT RESULTS
          ================================================= */}

          {showResults && analysisData && (

            <div className="analysis-results">


              {/* =============================================
                  RESULT HEADER
              ============================================= */}

              <div className="final-decision-header">

                <div>

                  <p className="final-label">
                    MULTI-AGENT ANALYSIS OUTPUT
                  </p>

                  <h2 className="results-title">
                    Analysis Results
                  </h2>

                </div>


                <span className="analysis-completed-badge">
                  ✓ Analysis Completed
                </span>

              </div>


              {/* =============================================
                  MAIN RESULT CARDS
              ============================================= */}

              <div className="results-grid">

                <ResultCard
                  title="Security Score"
                  value={`${securityScore}%`}
                  color="#22c55e"
                />

                <ResultCard
                  title="Code Quality"
                  value={`${codeQualityScore}%`}
                  color="#3b82f6"
                />

                <ResultCard
                  title="High Risk Issues"
                  value={highRisk}
                  color="#ef4444"
                />

                <ResultCard
                  title="Warnings"
                  value={warnings}
                  color="#f59e0b"
                />

              </div>


              {/* =================================================
                  AGENT 01 — STATIC ANALYSIS
              ================================================= */}

              <div className="decision-summary">

                <div>

                  <span>
                    AGENT 01
                  </span>

                  <h2>
                    Static Analysis
                  </h2>

                </div>


                <p>

                  Pylint detected{" "}

                  <strong>
                    {staticTotal}
                  </strong>{" "}

                  total findings including{" "}

                  <strong>
                    {errors}
                  </strong>{" "}

                  errors,{" "}

                  <strong>
                    {warnings}
                  </strong>{" "}

                  warnings,{" "}

                  <strong>
                    {refactor}
                  </strong>{" "}

                  refactor findings and{" "}

                  <strong>
                    {convention}
                  </strong>{" "}

                  convention findings.

                </p>

              </div>


              {/* =================================================
                  STATIC FINDINGS
              ================================================= */}

              <div className="analysis-findings-section">

                <h2>
                  Static Analysis Findings
                </h2>


                {analysisData.static_analysis?.findings
                  ?.length === 0 ? (

                  <p className="no-findings">
                    ✓ No static analysis issues detected.
                  </p>

                ) : (

                  analysisData.static_analysis?.findings?.map(
                    (finding, index) => (

                      <div
                        className="finding-item"
                        key={`static-${index}`}
                      >

                        <div>

                          <strong>
                            {finding.type?.toUpperCase()}
                          </strong>

                          <span>
                            Line {finding.line}
                          </span>

                        </div>

                        <p>
                          {finding.message}
                        </p>

                        <small>
                          {finding.symbol}
                        </small>

                      </div>

                    )
                  )

                )}

              </div>


              {/* =================================================
                  AGENT 02 — SECURITY ANALYSIS
              ================================================= */}

              <div className="decision-summary">

                <div>

                  <span>
                    AGENT 02
                  </span>

                  <h2>
                    Security Analysis
                  </h2>

                </div>


                <p>

                  Bandit detected{" "}

                  <strong>
                    {securityTotal}
                  </strong>{" "}

                  security findings:{" "}

                  <strong>
                    {highRisk}
                  </strong>{" "}

                  high,{" "}

                  <strong>
                    {mediumRisk}
                  </strong>{" "}

                  medium and{" "}

                  <strong>
                    {lowRisk}
                  </strong>{" "}

                  low severity issues.

                </p>

              </div>


              {/* =================================================
                  SECURITY FINDINGS
              ================================================= */}

              <div className="analysis-findings-section">

                <h2>
                  Security Analysis Findings
                </h2>


                {analysisData.security_analysis?.findings
                  ?.length === 0 ? (

                  <p className="no-findings">
                    ✓ No security vulnerabilities detected.
                  </p>

                ) : (

                  analysisData.security_analysis?.findings?.map(
                    (finding, index) => (

                      <div
                        className="finding-item"
                        key={`security-${index}`}
                      >

                        <div>

                          <strong>
                            {finding.severity}
                          </strong>

                          <span>
                            Line {finding.line}
                          </span>

                        </div>

                        <p>
                          {finding.message}
                        </p>

                        <small>

                          {finding.test_id}
                          {" • "}
                          {finding.test_name}
                          {" • "}
                          Confidence: {finding.confidence}

                        </small>

                      </div>

                    )
                  )

                )}

              </div>


              {/* =================================================
                  AGENT 03 — AI REVIEW AGENT
              ================================================= */}

              <div className="decision-summary">

                <div>

                  <span>
                    AGENT 03
                  </span>

                  <h2>
                    AI Review Agent
                  </h2>

                </div>


                {aiSuccess ? (

                  <p>
                    {aiReview?.summary ||
                      "Gemini AI generated optimized code candidates."}
                  </p>

                ) : (

                  <p>

                    AI Review could not be completed.

                    {aiReview?.error
                      ? ` ${aiReview.error}`
                      : ""}

                  </p>

                )}

              </div>


              {/* =================================================
                  OPTIMIZED CANDIDATES
              ================================================= */}

              {aiSuccess && (

                <div className="analysis-findings-section">

                  <h2>
                    Optimized Code Candidates
                  </h2>

                  <p
                    style={{
                      marginBottom: "20px",
                      opacity: 0.8,
                    }}
                  >
                    Agent 03 generated {candidates.length} optimized
                    versions of the original source code.
                  </p>


                  {candidates.map((candidate) => {

                    const scores =
                      candidate.estimated_scores || {};

                    return (

                      <div
                        className="finding-item"
                        key={`candidate-${candidate.candidate_id}`}
                        style={{
                          marginBottom: "22px",
                        }}
                      >

                        {/* CANDIDATE HEADER */}

                        <div>

                          <strong>
                            Candidate {candidate.candidate_id}
                            {" — "}
                            {candidate.name}
                          </strong>

                          <span>
                            {candidate.focus}
                          </span>

                        </div>


                        {/* DESCRIPTION */}

                        <p>
                          {candidate.description}
                        </p>


                        {/* SCORE GRID */}

                        <div
                          className="results-grid"
                          style={{
                            marginTop: "18px",
                            marginBottom: "18px",
                          }}
                        >

                          <ResultCard
                            title="Security"
                            value={`${scores.security ?? 0}%`}
                            color="#22c55e"
                          />

                          <ResultCard
                            title="Readability"
                            value={`${scores.readability ?? 0}%`}
                            color="#3b82f6"
                          />

                          <ResultCard
                            title="Maintainability"
                            value={`${scores.maintainability ?? 0}%`}
                            color="#8b5cf6"
                          />

                          <ResultCard
                            title="Performance"
                            value={`${scores.performance ?? 0}%`}
                            color="#f59e0b"
                          />

                          <ResultCard
                            title="Reliability"
                            value={`${scores.reliability ?? 0}%`}
                            color="#06b6d4"
                          />

                        </div>


                        {/* TIME COMPLEXITY */}

                        <p>

                          <strong>
                            Time Complexity:
                          </strong>{" "}

                          {candidate.time_complexity ||
                            "Not available"}

                        </p>


                        {/* VIEW CODE BUTTON */}

                        <button
                          type="button"
                          className="analyze-btn"
                          style={{
                            marginTop: "12px",
                            width: "auto",
                            padding: "10px 18px",
                          }}
                          onClick={() =>
                            toggleCandidateCode(
                              candidate.candidate_id
                            )
                          }
                        >

                          {visibleCandidate ===
                          candidate.candidate_id
                            ? "Hide Optimized Code"
                            : "View Optimized Code"}

                        </button>


                        {/* OPTIMIZED CODE */}

                        {visibleCandidate ===
                          candidate.candidate_id && (

                          <pre
                            style={{
                              marginTop: "16px",
                              padding: "18px",
                              borderRadius: "10px",
                              overflowX: "auto",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              background: "#0f172a",
                              color: "#e2e8f0",
                              fontSize: "13px",
                              lineHeight: "1.6",
                            }}
                          >
                            <code>
                              {candidate.optimized_code}
                            </code>
                          </pre>

                        )}

                      </div>

                    );

                  })}

                </div>

              )}


              {/* =================================================
                  AGENT 04 — DECISION AGENT
              ================================================= */}

              <div className="decision-summary">

                <div>

                  <span>
                    AGENT 04
                  </span>

                  <h2>
                    Decision Agent
                  </h2>

                </div>


                {decisionSuccess ? (

                  <p>
                    The Decision Agent compared all optimized
                    candidates and selected the solution with the
                    highest weighted overall score.
                  </p>

                ) : (

                  <p>

                    Decision Agent could not complete the final
                    selection.

                    {decision?.error
                      ? ` ${decision.error}`
                      : ""}

                  </p>

                )}

              </div>


              {/* =================================================
                  FINAL DECISION
              ================================================= */}

              {decisionSuccess && (

                <>

                  <div
                    className="analysis-findings-section"
                    style={{
                      marginTop: "20px",
                    }}
                  >

                    <p className="final-label">
                      🏆 BEST OPTIMIZED SOLUTION
                    </p>


                    <h2
                      style={{
                        marginTop: "8px",
                      }}
                    >
                      Candidate{" "}
                      {decision.selected_candidate_id}
                      {" — "}
                      {decision.selected_candidate_name}
                    </h2>


                    <p
                      style={{
                        marginTop: "12px",
                      }}
                    >

                      <strong>
                        Overall Score:
                      </strong>{" "}

                      {decision.overall_score}%

                    </p>


                    <p>

                      <strong>
                        Time Complexity:
                      </strong>{" "}

                      {decision.time_complexity ||
                        "Not available"}

                    </p>


                    <p
                      style={{
                        marginTop: "12px",
                      }}
                    >
                      {decision.reason}
                    </p>


                    {/* FINAL SELECTED SCORES */}

                    <div
                      className="results-grid"
                      style={{
                        marginTop: "22px",
                      }}
                    >

                      <ResultCard
                        title="Security"
                        value={`${selectedScores.security ?? 0}%`}
                        color="#22c55e"
                      />

                      <ResultCard
                        title="Readability"
                        value={`${selectedScores.readability ?? 0}%`}
                        color="#3b82f6"
                      />

                      <ResultCard
                        title="Maintainability"
                        value={`${selectedScores.maintainability ?? 0}%`}
                        color="#8b5cf6"
                      />

                      <ResultCard
                        title="Performance"
                        value={`${selectedScores.performance ?? 0}%`}
                        color="#f59e0b"
                      />

                      <ResultCard
                        title="Reliability"
                        value={`${selectedScores.reliability ?? 0}%`}
                        color="#06b6d4"
                      />

                    </div>


                    {/* FINAL CODE BUTTON */}

                    <button
                      type="button"
                      className="analyze-btn"
                      style={{
                        marginTop: "22px",
                        width: "auto",
                        padding: "11px 20px",
                      }}
                      onClick={() =>
                        setShowFinalCode(
                          !showFinalCode
                        )
                      }
                    >

                      {showFinalCode
                        ? "Hide Final Optimized Code"
                        : "View Final Optimized Code"}

                    </button>


                    {/* FINAL OPTIMIZED CODE */}

                    {showFinalCode && (

                      <pre
                        style={{
                          marginTop: "18px",
                          padding: "20px",
                          borderRadius: "10px",
                          overflowX: "auto",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          background: "#0f172a",
                          color: "#e2e8f0",
                          fontSize: "13px",
                          lineHeight: "1.6",
                        }}
                      >
                        <code>
                          {decision.final_optimized_code}
                        </code>
                      </pre>

                    )}

                  </div>


                  {/* =============================================
                      CANDIDATE COMPARISON
                  ============================================= */}

                  <div className="analysis-findings-section">

                    <h2>
                      Decision Agent Comparison
                    </h2>


                    {decision.candidate_comparison?.map(
                      (candidate) => (

                        <div
                          className="finding-item"
                          key={`decision-${candidate.candidate_id}`}
                        >

                          <div>

                            <strong>
                              Candidate{" "}
                              {candidate.candidate_id}
                              {" — "}
                              {candidate.name}
                            </strong>

                            <span>
                              Overall:{" "}
                              {candidate.overall_score}%
                            </span>

                          </div>


                          <p>
                            Security: {candidate.security}%{" • "}
                            Readability: {candidate.readability}%{" • "}
                            Maintainability:{" "}
                            {candidate.maintainability}%{" • "}
                            Performance: {candidate.performance}%{" • "}
                            Reliability: {candidate.reliability}%
                          </p>


                          <small>
                            {candidate.time_complexity}
                          </small>

                        </div>

                      )
                    )}

                  </div>

                </>

              )}


            </div>

          )}

        </div>


        {/* =================================================
            RIGHT SIDE PIPELINE
        ================================================= */}

        <Pipeline
          currentStage={currentStage}
        />

      </div>

    </div>

  );

}


export default CodeAnalyzer;