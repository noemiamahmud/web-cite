import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicFetch } from '../api/apiClient';
import './parent.css';
import './login.css';

function Login() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignupClick = () => {
        navigate('/signup');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); //prevent default form behavior 
        setError('');
        try {
            const data = await publicFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ emailOrUsername, password }),
            });
            if (data.token) {
                console.log("SIGNED IN", data);
                localStorage.setItem('token', data.token);
                navigate('/'); //CHANGE TO SIGNED IN VERSION ONCE ITS UP
            } else {
                setError('Invalid credentials');
            }
        } catch (error) {
            console.error(error)
            setError("Sign in Error");
        }
    }

    return (
        <div className='login-container'>
            <h2 className='heading'> Sign In </h2>
            <form onSubmit={handleSubmit}>
                <div className='input-group'>
                    <label htmlFor="emailOrUsername">Email or Username:</label>
                    <input
                        value={emailOrUsername}
                        name="emailOrUsername"
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        required />
                </div>
                <div className='input-group'>
                    <label htmlFor='password'>Password:</label>
                    <input
                        type="password"
                        value={password}
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                </div>
                {error && <p className="error">{error}</p>}
                <div className='button-group'>
                    <button className="buttons" id="login-button" type="submit">Login</button>
                    <button className="buttons" id="signup-button" type="button" onClick={handleSignupClick}>Sign Up</button>
                </div>
            </form>
        </div>
    );
}

export default Login; 