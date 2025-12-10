import defaultProfile from '../components/componentassets/gg--profile.png';
import { authFetch } from '../api/apiClient';
import { useState, useEffect } from 'react';
import "./profile.css";

interface UserInfo {
  username: string;
  email: string;
}


function Profile() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
    if (token) {
      authFetch('/api/auth/me')
        .then(data => {
            console.log(data);
            setUserInfo(data); 
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
        });
    }
  }, [token]);

    return (
        <div className="profile-page">
            <h1>User Profile</h1>

            <div className="user-info">
                <img src={defaultProfile} alt="Profile Icon" />
                <div className='user-content'>
                    <div>
                        <h2>{userInfo?.username || 'USERNAME'}</h2>
                        <p>Email: {userInfo?.email || 'user@example.com'}</p>
                    </div>
                    <div>
                        <p>Webs Created: ##</p>
                    </div>
                </div>
            </div>

            <div className="user-list">
                <h2>Your Webs</h2>
                <p>List of webs created by the user will be displayed here.</p>
            </div>

            {/* <div className="user-list">
                <h2>Saved Articles</h2>
                <p>List of articles saved by the user will be displayed here.</p>
            </div> */}

        </div>
    );
}

export default Profile;
