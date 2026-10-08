import {
  LayoutDashboard,
  Code2,
  BarChart3,
  FileText,
  History,
  Info,
  ShieldCheck,
} from "lucide-react";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "analyzer",
    label: "Code Analyzer",
    icon: Code2,
  },
  {
    id: "analytics",
    label: "Analysis Insights",
    icon: BarChart3,
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileText,
  },
  {
    id: "history",
    label: "History",
    icon: History,
  },
  {
    id: "about",
    label: "About",
    icon: Info,
  },
];

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">

      <div className="logo-section">

        <ShieldCheck size={36} />

        <div>
          <h2>Multi Agentic AI</h2>
          <p>Code Review System</p>
        </div>

      </div>


      <nav className="sidebar-menu">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={`menu-btn ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => setActivePage(item.id)}
            >

              <Icon size={20} />

              <span>
                {item.label}
              </span>

            </button>
          );

        })}

      </nav>


      <div className="sidebar-footer">

        <p>Version 1.0</p>

        <small>
          Agentic AI Platform
        </small>

      </div>

    </aside>
  );
}

export default Sidebar;