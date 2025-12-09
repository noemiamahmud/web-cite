import "./defaultHeader.css";
import { useNavigate } from "react-router-dom";
import logo from "./componentAssets/web-cite-logo.svg";
import profileIcon from "./componentAssets/gg--profile.png";

export default function DefaultHeaderSignedOut() {
  const navigate = useNavigate();

  return (
    <div className="Default-top">
      {/* ✅ LOGO → SEARCH */}
      <img
        id="Web-Cite-logo"
        src={logo}
        alt="Logo"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      />

      <div className="right-side">
        <button id="login-link" onClick={() => navigate("/login")}>
          Login / Sign Up
        </button>
        <img className="profile-icon" src={profileIcon} alt="Profile Icon" />
      </div>
    </div>
  );
}
