import Header from "./Header";

import {
  History as HistoryIcon,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react";

function History() {

  const historyData = [
    {
      id: 1,
      file: "login_system.py",
      language: "Python",
      date: "03 Aug 2026",
      time: "10:30 AM",
      score: "96%",
      issues: 2,
    },
    {
      id: 2,
      file: "banking_app.py",
      language: "Python",
      date: "02 Aug 2026",
      time: "04:15 PM",
      score: "82%",
      issues: 4,
    },
    {
      id: 3,
      file: "user_api.js",
      language: "JavaScript",
      date: "01 Aug 2026",
      time: "02:20 PM",
      score: "89%",
      issues: 3,
    },
    {
      id: 4,
      file: "Main.java",
      language: "Java",
      date: "31 Jul 2026",
      time: "11:10 AM",
      score: "93%",
      issues: 1,
    },
  ];

  return (
    <div>

      <Header
        title="Analysis History"
        subtitle="Track previously completed multi-agent code analyses"
      />


      <div className="history-summary">

        <div>

          <HistoryIcon size={25} />

          <div>
            <h2>Recent Analyses</h2>

            <p>
              Your latest multi-agent code analysis activity
            </p>
          </div>

        </div>

        <span>
          {historyData.length} Analyses
        </span>

      </div>


      <div className="history-list">

        {historyData.map((item) => (

          <div
            className="history-card"
            key={item.id}
          >

            <div className="history-file">

              <div className="history-file-icon">
                <FileCode2 size={24} />
              </div>

              <div>
                <h3>{item.file}</h3>
                <span>{item.language}</span>
              </div>

            </div>


            <div className="history-info">

              <span>Date</span>

              <strong>
                {item.date}
              </strong>

            </div>


            <div className="history-info">

              <span>Time</span>

              <strong className="history-time">

                <Clock size={14} />

                {item.time}

              </strong>

            </div>


            <div className="history-info">

              <span>
                Security Score
              </span>

              <strong className="history-score">

                <CheckCircle2 size={15} />

                {item.score}

              </strong>

            </div>


            <div className="history-info">

              <span>
                Issues
              </span>

              <strong className="history-issues">

                <AlertTriangle size={15} />

                {item.issues}

              </strong>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default History;