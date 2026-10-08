import Header from "./Header";

import {
  ShieldCheck,
  BrainCircuit,
  Bug,
  ShieldAlert,
  GitMerge,
  Code2,
  Database,
  Server,
} from "lucide-react";

function About() {
  return (
    <div>

      {/* HEADER */}

      <Header
        title="About Multi-Agentic AI Code Review System"
        subtitle="AI-powered code review and security analysis platform"
      />


      {/* PROJECT OVERVIEW */}

      <section className="about-hero">

        <div className="about-logo">
          <ShieldCheck size={38} />
        </div>

        <div>

          <p className="about-label">
            PROJECT OVERVIEW
          </p>

          <h2>
            Multi-Agentic AI Code Review System
          </h2>

          <p>
            The Multi-Agentic AI Code Review System is designed
            to analyze source code for code quality issues,
            security vulnerabilities and improvement opportunities
            using multiple specialized analysis agents.
          </p>

        </div>

      </section>


      {/* MULTI-AGENT ARCHITECTURE */}

      <section className="about-section">

        <h2>
          Multi-Agent Architecture
        </h2>

        <div className="about-agents-grid">


          {/* AGENT 01 */}

          <div className="about-agent-card">

            <Bug size={27} />

            <h3>
              Static Analysis Agent
            </h3>

            <p>
              Reviews source code for errors,
              maintainability, complexity and
              coding-standard issues.
            </p>

          </div>


          {/* AGENT 02 */}

          <div className="about-agent-card">

            <ShieldAlert size={27} />

            <h3>
              Security Analysis Agent
            </h3>

            <p>
              Detects vulnerabilities, unsafe
              functions, hardcoded credentials
              and security risks.
            </p>

          </div>


          {/* AGENT 03 */}

          <div className="about-agent-card">

            <BrainCircuit size={27} />

            <h3>
              AI Review Agent
            </h3>

            <p>
              Uses artificial intelligence to
              generate code improvement,
              explanation and optimization
              recommendations.
            </p>

          </div>


          {/* AGENT 04 */}

          <div className="about-agent-card">

            <GitMerge size={27} />

            <h3>
              Decision Agent
            </h3>

            <p>
              Combines findings from the analysis
              agents and generates the final risk
              assessment and report.
            </p>

          </div>

        </div>

      </section>


      {/* TECHNOLOGY STACK */}

      <section className="about-section">

        <h2>
          Technology Stack
        </h2>

        <div className="technology-grid">


          <div className="technology-card">

            <Code2 />

            <span>
              React + Vite
            </span>

            <small>
              Frontend
            </small>

          </div>


          <div className="technology-card">

            <Server />

            <span>
              Python + Flask
            </span>

            <small>
              Backend
            </small>

          </div>


          <div className="technology-card">

            <Bug />

            <span>
              Pylint
            </span>

            <small>
              Static Analysis
            </small>

          </div>


          <div className="technology-card">

            <ShieldCheck />

            <span>
              Bandit
            </span>

            <small>
              Security Analysis
            </small>

          </div>


          <div className="technology-card">

            <BrainCircuit />

            <span>
              Gemini AI
            </span>

            <small>
              AI Review
            </small>

          </div>


          <div className="technology-card">

            <Database />

            <span>
              SQLite
            </span>

            <small>
              Database
            </small>

          </div>

        </div>

      </section>


      {/* SYSTEM WORKFLOW */}

      <section className="about-workflow">

        <h2>
          System Workflow
        </h2>

        <div className="workflow-line">

          <span>
            Source Code
          </span>

          <b>→</b>

          <span>
            Static + Security Analysis
          </span>

          <b>→</b>

          <span>
            AI Review
          </span>

          <b>→</b>

          <span>
            Decision Agent
          </span>

          <b>→</b>

          <span>
            Final Report
          </span>

        </div>

      </section>

    </div>
  );
}

export default About;