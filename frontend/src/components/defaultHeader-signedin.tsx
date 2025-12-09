import { Navigate, useNavigate } from 'react-router';
import logo from './componentAssets/web-cite-logo.svg';
import profileIcon from './componentAssets/gg--profile.png';
import './defaultHeader.css';

export default function DefaultHeaderSignedIn() {
  const navigate = useNavigate(); 
  const text = "username"; // Placeholder for dynamic username

  const handleHomeClick = () => {
    navigate('/search');
  }

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <>
      <div className="Default-top">
        <img id="Web-Cite-logo" src={logo} alt="Logo" onClick={handleHomeClick} />
        <div className="right-side">
          <button id="login-link">{text}</button>
          <img className="profile-icon" src={profileIcon} alt="Profile Icon" onClick={handleProfileClick} />
        </div>
      </div>

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
