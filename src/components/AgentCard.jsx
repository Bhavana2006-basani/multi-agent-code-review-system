import { ShieldCheck } from "lucide-react";

function AgentCard({ title, description }) {
  return (
    <div className="agent-card">

      <div className="agent-icon">
        <ShieldCheck size={28} />
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <button className="agent-btn">
        Ready
      </button>

    </div>
  );
}

export default AgentCard;