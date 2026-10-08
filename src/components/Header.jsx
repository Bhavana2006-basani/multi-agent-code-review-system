import { Bell, UserCircle2 } from "lucide-react";

function Header({ title, subtitle }) {
  return (
    <header className="header">

      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="header-right">

        <div className="status">
          <span className="status-dot"></span>
          System Online
        </div>

        <button className="notification-btn">
          <Bell size={20} />
        </button>

        <div className="profile">
          <UserCircle2 size={35} />
          <div>
            <h4>Bhavana</h4>
            <span>Cyber Analyst</span>
          </div>
        </div>

      </div>

    </header>
  );
}

export default Header;