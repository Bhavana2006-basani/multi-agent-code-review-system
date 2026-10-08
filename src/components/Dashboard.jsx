import Header from "./Header";
import StatCard from "./StatCard";

import {
  BrainCircuit,
  Bug,
  ShieldAlert,
  GitMerge,
  ArrowDown,
  CheckCircle2,
  Play,
} from "lucide-react";


function Dashboard({ setActivePage, analysisData }) {

  // =====================================================
  // REAL ANALYSIS DATA
  // =====================================================

  const staticSummary =
    analysisData?.static_analysis?.summary;

  const securitySummary =
    analysisData?.security_analysis?.summary;

  const decision =
    analysisData?.decision;


  // =====================================================
  // STATIC ANALYSIS VALUES
  // =====================================================

  const errors =
    staticSummary?.errors ?? 0;

  const warnings =
    staticSummary?.warnings ?? 0;

  const refactor =
    staticSummary?.refactor ?? 0;

  const convention =
    staticSummary?.convention ?? 0;


  // =====================================================
  // SECURITY ANALYSIS VALUES
  // =====================================================

  const highRisk =
    securitySummary?.high ?? 0;

  const mediumRisk =
    securitySummary?.medium ?? 0;

  const lowRisk =
    securitySummary?.low ?? 0;


  // =====================================================
  // CALCULATED SCORES
  // =====================================================

  const codeQualityScore = analysisData
    ? Math.max(
        0,
        100 -
          errors * 15 -
          warnings * 5 -
          refactor * 3 -
          convention * 2
      )
    : 0;


  const securityScore = analysisData
    ? Math.max(
        0,
        100 -
          highRisk * 20 -
          mediumRisk * 10 -
          lowRisk * 5
      )
    : 0;


  const totalVulnerabilities =
    highRisk +
    mediumRisk +
    lowRisk;


  const finalOptimizedScore =
    decision?.success
      ? decision.overall_score
      : 0;


  return (

    <div>

      <Header
        title="Agentic Command Center"
        subtitle="Multi-Agentic AI Code Review & Security Analysis System"
      />


      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="agentic-hero">

        <div className="agentic-hero-content">

          <p className="agentic-label">
            MULTI-AGENTIC AI PLATFORM
          </p>


          <h1>

            Intelligent Code Review Through

            <span>
              {" "}Collaborative AI Agents
            </span>

          </h1>


          <p className="agentic-description">

            Four specialized agents collaborate to analyze
            code quality, detect security vulnerabilities,
            generate optimized code candidates and select
            the best optimized solution.

          </p>


          <div className="agentic-system-status">

            <div>

              <span className="online-dot"></span>

              System Online

            </div>


            <div>

              <CheckCircle2 size={17} />

              4 Agents Ready

            </div>

          </div>


          <button
            className="start-analysis-btn"
            onClick={() =>
              setActivePage?.("analyzer")
            }
          >

            <Play size={18} />

            Start Agentic Analysis

          </button>

        </div>

      </section>


      {/* =====================================================
          REAL STATISTICS
      ===================================================== */}

      <div className="stats-grid">


        <StatCard
          title="Security Score"
          value={
            analysisData
              ? `${securityScore}%`
              : "--"
          }
          color="#10b981"
        />


        <StatCard
          title="Code Quality"
          value={
            analysisData
              ? `${codeQualityScore}%`
              : "--"
          }
          color="#3b82f6"
        />


        <StatCard
          title="Vulnerabilities"
          value={
            analysisData
              ? totalVulnerabilities
              : "--"
          }
          color="#ef4444"
        />


        <StatCard
          title="Final Optimized Score"
          value={
            decision?.success
              ? `${finalOptimizedScore}%`
              : "--"
          }
          color="#f59e0b"
        />


      </div>


      {/* =====================================================
          NO ANALYSIS MESSAGE
      ===================================================== */}

      {!analysisData && (

        <div
          className="decision-summary"
          style={{
            marginTop: "20px",
          }}
        >

          <div>

            <span>
              ANALYSIS STATUS
            </span>

            <h2>
              No Analysis Yet
            </h2>

          </div>


          <p>

            Start an Agentic Analysis to view real security,
            code quality, vulnerability and optimization
            results on this dashboard.

          </p>

        </div>

      )}


      {/* =====================================================
          LATEST ANALYSIS SUMMARY
      ===================================================== */}

      {analysisData && decision?.success && (

        <div
          className="decision-summary"
          style={{
            marginTop: "20px",
          }}
        >

          <div>

            <span>
              LATEST DECISION
            </span>

            <h2>

              Candidate{" "}
              {decision.selected_candidate_id}
              {" — "}
              {decision.selected_candidate_name}

            </h2>

          </div>


          <p>

            Decision Agent selected this candidate with an
            overall score of{" "}

            <strong>
              {decision.overall_score}%
            </strong>

            {" "}after comparing security, readability,
            maintainability, performance and reliability.

          </p>

        </div>

      )}


      {/* =====================================================
          AGENTIC WORKFLOW
      ===================================================== */}

      <section className="agentic-workflow-section">


        <div className="agentic-section-header">

          <div>

            <p>
              AGENT COLLABORATION
            </p>

            <h2>
              Agentic Analysis Workflow
            </h2>

          </div>


          <span className="agents-ready">

            <span className="online-dot"></span>

            4 Agents Ready

          </span>

        </div>


        <div className="agentic-workflow">


          {/* =================================================
              AGENT 01 + AGENT 02
          ================================================= */}

          <div className="parallel-agents">


            {/* AGENT 01 */}

            <div className="workflow-agent">

              <div className="workflow-agent-icon">

                <Bug size={27} />

              </div>


              <div className="agent-id">
                AGENT 01
              </div>


              <h3>
                Static Analysis Agent
              </h3>


              <p>

                Examines Python source code for code quality,
                syntax, maintainability and coding-standard
                issues.

              </p>


              <div className="agent-tool">
                Tool: Pylint
              </div>


              <div className="agent-ready-status">

                <CheckCircle2 size={15} />

                Ready

              </div>

            </div>


            <div className="parallel-connector">

              <span>
                PARALLEL ANALYSIS
              </span>

            </div>


            {/* AGENT 02 */}

            <div className="workflow-agent">

              <div className="workflow-agent-icon security-icon">

                <ShieldAlert size={27} />

              </div>


              <div className="agent-id">
                AGENT 02
              </div>


              <h3>
                Security Analysis Agent
              </h3>


              <p>

                Detects vulnerabilities, insecure functions,
                unsafe coding patterns and potential security
                risks.

              </p>


              <div className="agent-tool">
                Tool: Bandit
              </div>


              <div className="agent-ready-status">

                <CheckCircle2 size={15} />

                Ready

              </div>

            </div>

          </div>


          <ArrowDown
            className="workflow-arrow"
            size={28}
          />


          {/* =================================================
              AGENT 03
          ================================================= */}

          <div className="workflow-agent ai-review-agent">

            <div className="workflow-agent-icon ai-icon">

              <BrainCircuit size={28} />

            </div>


            <div className="agent-id">
              AGENT 03
            </div>


            <h3>
              AI Review Agent
            </h3>


            <p>

              Reviews the original code together with Pylint
              and Bandit findings and generates four optimized
              source-code candidates.

            </p>


            <div className="agent-tool">
              Model: Gemini AI
            </div>


            <div className="agent-ready-status">

              <CheckCircle2 size={15} />

              Ready

            </div>

          </div>


          <ArrowDown
            className="workflow-arrow"
            size={28}
          />


          {/* =================================================
              AGENT 04
          ================================================= */}

          <div className="workflow-agent decision-agent">

            <div className="workflow-agent-icon decision-icon">

              <GitMerge size={28} />

            </div>


            <div className="agent-id">
              AGENT 04
            </div>


            <h3>
              Decision Agent
            </h3>


            <p>

              Compares all four optimized candidates using
              security, readability, maintainability,
              reliability and performance scores and selects
              the best solution.

            </p>


            <div className="agent-tool">
              Output: Best Optimized Code
            </div>


            <div className="agent-ready-status">

              <CheckCircle2 size={15} />

              Ready

            </div>

          </div>


          <ArrowDown
            className="workflow-arrow"
            size={28}
          />


          {/* =================================================
              FINAL OUTPUT
          ================================================= */}

          <div className="final-output-box">

            <CheckCircle2 size={27} />


            <div>

              <span>
                FINAL OUTPUT
              </span>


              <h3>
                Best Optimized & Secure Source Code
              </h3>

            </div>

          </div>


        </div>

      </section>

    </div>

  );
}


export default Dashboard;