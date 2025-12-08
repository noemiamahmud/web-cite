import { Navigate } from 'react-router';
import logo from './componentAssets/web-cite-logo.svg';
import profileIcon from './componentAssets/gg--profile.png';
import './defaultHeader.css';

export default function DefaultHeaderSignedIn() {
    const text = "username"; // Placeholder for dynamic username
    
    return (
    <>
      <div className="Default-top">
        <img id="Web-Cite-logo" src={logo} alt="Logo"/>
        <div className="right-side">
          <button id="login-link">{text}</button>
          <img className="profile-icon" src={profileIcon} alt="Profile Icon" />
        </div>
      </div>

      {/* <div className="Default-bottom">
        <div className="search">
          <input type="text" placeholder="Search..." />
        </div>
        <div className="default-buttons">
          <button>Search</button>
          
        </div>
      </div> */}
    </>
  );
}
