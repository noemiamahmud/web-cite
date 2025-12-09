// import "./defaultHeader.css";
import "./NavBar.css";             // new navbar styles

import { useNavigate } from "react-router-dom";
import logo from "./componentAssets/web-cite-logo.svg";
import profileIcon from "./componentAssets/gg--profile.png";

export default function DefaultHeaderSignedOut() {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      {/* ✅ LOGO → SEARCH */}
      <div className="navbar-logo">
      <img
        // className="navbar-logo"
        id="Web-Cite-logo"
        src={logo}
        alt="Logo"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      />
      </div>

      <div className="navbar-buttons">
        <button className="nav-btn" onClick={() => navigate("/login")}>
          Login / Sign Up
        </button>

        <button
          type="button"
          className="profile-icon-btn"
          onClick={() => navigate("/login")}
        >
          <img className="profile-icon" src={profileIcon} alt="Profile Icon" />
        </button>
      </div>
    </div>
  );
}
