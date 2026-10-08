import {
  Bug,
  ShieldAlert,
  BrainCircuit,
  GitMerge,
  CheckCircle2,
  LoaderCircle,
  Circle,
} from "lucide-react";

function Pipeline({ currentStage }) {

  const agents = [
    {
      id: "static",
      name: "Static Analysis Agent",
      description: "Code quality & syntax analysis",
      tool: "Pylint",
      icon: Bug,
    },
    {
      id: "security",
      name: "Security Analysis Agent",
      description: "Security vulnerability scanning",
      tool: "Bandit",
      icon: ShieldAlert,
    },
    {
      id: "ai",
      name: "AI Review Agent",
      description: "Intelligent code review",
      tool: "Gemini AI",
      icon: BrainCircuit,
    },
    {
      id: "decision",
      name: "Decision Agent",
      description: "Final risk assessment",
      tool: "Decision Engine",
      icon: GitMerge,
    },
  ];


  // =========================
  // AGENT STATUS
  // =========================

  const getAgentStatus = (agentId) => {

    // Before analysis
    if (currentStage === "idle") {
      return "pending";
    }


    // Static + Security running together
    if (currentStage === "analysis") {

      if (
        agentId === "static" ||
        agentId === "security"
      ) {
        return "running";
      }

      return "pending";
    }


    // AI Review running
    if (currentStage === "ai") {

      if (
        agentId === "static" ||
        agentId === "security"
      ) {
        return "completed";
      }

      if (agentId === "ai") {
        return "running";
      }

      return "pending";
    }


    // Decision Agent running
    if (currentStage === "decision") {

      if (
        agentId === "static" ||
        agentId === "security" ||
        agentId === "ai"
      ) {
        return "completed";
      }

      if (agentId === "decision") {
        return "running";
      }

      return "pending";
    }


    // Everything completed
    if (currentStage === "completed") {
      return "completed";
    }


    return "pending";
  };


  return (
    <div className="pipeline">

      {/* =========================
          HEADER
      ========================== */}

      <div className="pipeline-heading">

        <div>

          <p className="pipeline-label">
            LIVE AGENT EXECUTION
          </p>

          <h2>
            Agentic Pipeline
          </h2>

          <p>
            4-Agent Analysis Workflow
          </p>

        </div>

      </div>


      {/* =========================
          AGENTS
      ========================== */}

      {agents.map((agent, index) => {

        const Icon = agent.icon;

        const status = getAgentStatus(agent.id);

        return (

          <div
            className={`pipeline-card ${status}`}
            key={agent.id}
          >


            {/* AGENT NUMBER */}

            <div className="pipeline-agent-number">

              AGENT {String(index + 1).padStart(2, "0")}

            </div>


            {/* AGENT CONTENT */}

            <div className="pipeline-agent-content">


              <div className="pipeline-icon">

                <Icon size={22} />

              </div>


              <div className="pipeline-info">

                <h3>
                  {agent.name}
                </h3>

                <p>
                  {agent.description}
                </p>

                <span className="pipeline-tool">
                  {agent.tool}
                </span>

              </div>


            </div>


            {/* =========================
                STATUS
            ========================== */}

            <div
              className={`pipeline-status ${status}`}
            >


              {status === "pending" && (

                <>
                  <Circle size={15} />
                  <span>Pending</span>
                </>

              )}


              {status === "running" && (

                <>

                  <LoaderCircle
                    size={16}
                    className="pipeline-spinner"
                  />

                  <span>Running</span>

                </>

              )}


              {status === "completed" && (

                <>

                  <CheckCircle2 size={16} />

                  <span>Completed</span>

                </>

              )}


            </div>


            {/* CONNECTION LINE */}

            {index < agents.length - 1 && (

              <div className="pipeline-line"></div>

            )}


          </div>

        );

      })}


      {/* =========================
          FINAL OUTPUT
      ========================== */}

      <div
        className={`pipeline-final ${
          currentStage === "completed"
            ? "completed"
            : ""
        }`}
      >

        <GitMerge size={19} />

        <div>

          <span>
            FINAL OUTPUT
          </span>

          <p>
            Multi-Agent Analysis Report
          </p>

        </div>

      </div>


    </div>
  );
}

export default Pipeline;