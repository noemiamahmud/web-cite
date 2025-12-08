import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { publicFetch } from "../api/apiClient";
import "./parent.css";
import "./login.css";

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setError('');
        try {
            const data = await publicFetch('/api/auth/signup', {
                method: 'POST', 
                body: JSON.stringify({ username, email, password}),
            });
            if (data.token) {
                localStorage.setItem('token', data.token);
                console.log("SIGNED UP", data);
                navigate('/'); //CHANGE TO SIGNED IN VERSION ONCE ITS UP
            } else {
                setError('Sign up failed');
            }
        } catch (error) {
            console.error(error);
            setError("Sign up Error");
        }
    };

    return (
        <div className="login-container">
            <h2 className="heading"> Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group"> 
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        value={email}
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                </div>
                <div className="input-group"> 
                    <label htmlFor="username">Create User Name:</label>
                    <input
                        type="text"
                        value={username}
                        name="username"
                        onChange={(e) => setUsername(e.target.value)}
                        required />
                </div> 
                <div className="input-group"> 
                    <label htmlFor='password'>Create Password:</label>
                    <input
                        type="password"
                        value={password}
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                </div> 
                {error && <p className="error">{error}</p>}
                <button className="buttons" id="login-button" type="submit">Sign Up</button>
            </form>
        </div>
    )
}

export default Signup; 