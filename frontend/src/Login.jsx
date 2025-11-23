import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        localStorage.setItem('username', username);
        navigate('/dashboard');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 style={{fontSize: '1.8rem', marginBottom: '10px', fontWeight: 'bold'}}>Welcome Back</h2>
                <p style={{color: '#666', marginBottom: '30px'}}>IST Procurement Portal</p>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input 
                            type="text" 
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
export default Login;