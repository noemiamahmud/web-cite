import defaultProfile from '../components/componentassets/gg--profile.png';
import "./profile.css";

function Profile() {
    return (
        <div className="profile-page">
            <h1>User Profile</h1>

            <div className="user-info">
                <img src={defaultProfile} alt="Profile Icon" />
                <div className='user-content'>
                    <div>
                        <h2>USERNAME</h2>
                        <p>Email: user@example.com</p>
                    </div>
                    <div>
                        <p>Joined: MONTH, YEAR </p>
                        <p>Webs Created: ##</p>
                    </div>
                </div>
            </div>

            <div className="user-list">
                <h2>Your Webs</h2>
                <p>List of webs created by the user will be displayed here.</p>
            </div>

            <div className="user-list">
                <h2>Saved Articles</h2>
                <p>List of articles saved by the user will be displayed here.</p>
            </div>

        </div>
    );





}

export default Profile;
