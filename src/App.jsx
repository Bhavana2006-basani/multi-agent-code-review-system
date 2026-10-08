import { useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CodeAnalyzer from "./components/CodeAnalyzer";
import Analytics from "./components/Analytics";
import Reports from "./components/Reports";
import History from "./components/History";
import About from "./components/About";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  // Stores the latest real result returned by Flask
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <div className="app-container">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">
        {activePage === "dashboard" && (
          <Dashboard
            setActivePage={setActivePage}
            analysisData={analysisData}
        />
        )}

        {activePage === "analyzer" && (
          <CodeAnalyzer
            analysisData={analysisData}
            setAnalysisData={setAnalysisData}
          />
        )}

        {activePage === "analytics" && (
          <Analytics analysisData={analysisData} />
        )}

        {activePage === "reports" && <Reports />}

        {activePage === "history" && <History />}

        {activePage === "about" && <About />}
      </main>
    </div>
  );
}

export default App;