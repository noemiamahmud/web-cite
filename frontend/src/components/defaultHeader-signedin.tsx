import "./defaultHeader.css";
import { useNavigate } from "react-router-dom";
import logo from "./componentAssets/web-cite-logo.svg";
import profileIcon from "./componentAssets/gg--profile.png";

export default function DefaultHeaderSignedIn() {
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
        {/* ✅ MY WEBS */}
        <button onClick={() => navigate("/my-webs")}>My Webs</button>

        {/* ✅ LOGOUT */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </button>

        <img className="profile-icon" src={profileIcon} alt="Profile Icon" />
      </div>
    </div>
  );
}
