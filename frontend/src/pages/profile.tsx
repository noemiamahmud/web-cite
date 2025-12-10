import defaultProfile from '../components/componentassets/gg--profile.png';
import { authFetch } from '../api/apiClient';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import "./profile.css";
import "./MyWebs.css";

interface UserInfo {
    username: string;
    email: string;
}

type SavedWeb = {
    _id: string;
    title: string;
    description?: string;
    createdAt?: string;
};


function Profile() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const token = localStorage.getItem('token');
    const [webs, setWebs] = useState<SavedWeb[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    // UPDATE webs
    useEffect(() => {
        async function loadWebs() {
            try {
                const data = await authFetch("/api/webs");
                setWebs(data.webs);
            } catch (err) {
                console.error("Failed to load saved webs:", err);
                setError("Failed to load your saved webs.");
            } finally {
                setLoading(false);
            }
        }

        loadWebs();
    }, []);

    if (loading) return <p style={{ textAlign: "center" }}>Loading your webs...</p>;
    if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
    if (!webs.length)
        return <p style={{ textAlign: "center" }}>You haven’t created any webs yet.</p>;


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
                        <p>Webs Created: {webs.length}</p>
                    </div>
                </div>
            </div>

            <div className="user-list">
                <h2>Your Webs</h2>
                <p>List of webs created by the user will be displayed here.</p>
                <div className="web-list">
                    {webs.map(web => (
                        <div
                            key={web._id}
                            className="web-card"
                            onClick={() => navigate(`/web/${web._id}`)}
                        >
                            <h3>{web.title}</h3>
                            {web.description && <p>{web.description}</p>}
                            {web.createdAt && (
                                <small>Created: {new Date(web.createdAt).toLocaleDateString()}</small>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* <div className="user-list">
                <h2>Saved Articles</h2>
                <p>List of articles saved by the user will be displayed here.</p>
            </div> */}

        </div>
    );
}

export default Profile;
