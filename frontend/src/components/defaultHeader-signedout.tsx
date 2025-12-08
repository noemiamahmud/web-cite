import './defaultHeader.css';
import { useNavigate } from 'react-router-dom';
import logo from './componentAssets/web-cite-logo.svg';
import profileIcon from './componentAssets/gg--profile.png';

export default function DefaultHeaderSignedOut() {
  const navigate = useNavigate(); 
  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/search');
  }

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <>
      <div className="Default-top">
        <img id="Web-Cite-logo" src={logo} alt="Logo" onClick={handleHomeClick}/>
        <div className="right-side">
          <button id="login-link" onClick={handleLoginClick}>Login/Sign Up</button>
          <img className="profile-icon" src={profileIcon} alt="Profile Icon" onClick={handleProfileClick}/>
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
