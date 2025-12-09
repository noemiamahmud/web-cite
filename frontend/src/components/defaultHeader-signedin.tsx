import "./defaultHeader.css";      // keep this if other styles depend on it
import "./NavBar.css";             // new navbar styles


import { useNavigate } from "react-router-dom";
import logo from "./componentAssets/web-cite-logo.svg";
import profileIcon from "./componentAssets/gg--profile.png";


export default function DefaultHeaderSignedIn() {
 const navigate = useNavigate();


 const handleLogout = () => {
   localStorage.removeItem("token");
   navigate("/login");
 };


 return (
   <header className="navbar">
     {/* LEFT: logo → home/search */}
     <div className="navbar-logo" onClick={() => navigate("/")}>
       <img id="Web-Cite-logo" src={logo} alt="Web-Cite Logo" />
     </div>


     {/* RIGHT: buttons */}
     <div className="navbar-buttons">
       <button
         className="nav-btn"
         type="button"
         onClick={() => navigate("/my-webs")}
       >
         My Webs
       </button>


       <button
         className="nav-btn"
         type="button"
         onClick={handleLogout}
       >
         Logout
       </button>


       <button
         type="button"
         className="profile-icon-btn"
         onClick={() => navigate("/profile")}
       >
         <img className="profile-icon" src={profileIcon} alt="Profile Icon" />
       </button>
     </div>
   </header>
 );
}



