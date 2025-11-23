import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: 'https://ist-backend-05op.onrender.com/api/' });
// --- LOGIN COMPONENT ---
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulation for design purposes (Backend Auth is relaxed for demo)
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

// --- DASHBOARD COMPONENT ---
function Dashboard() {
  const user = localStorage.getItem('username') || 'User';
  const navigate = useNavigate();
  
  // STATE MANAGEMENT
  const [requests, setRequests] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'my_requests', 'approvals'
  
  // Modals & User Data
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false); // Controls Profile Modal
  const [userData, setUserData] = useState(null);        // Stores User Data
  
  // FORM STATE
  const [newRequest, setNewRequest] = useState({ title: '', description: '', amount: '', file: null });

  // 1. Fetch Requests Automatically
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('requests/');
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  // 2. Fetch User Profile (New Feature)
  const fetchProfile = async () => {
      try {
          // This calls the endpoint we created in backend/users/views.py
          const response = await api.get('users/me/');
          setUserData(response.data);
          setShowProfile(true);
      } catch (error) {
          alert("Could not load profile. Make sure the Backend User View is set up.");
      }
  };

  // 3. Submit New Request (Updated for File Upload)
  const handleSubmit = async (e) => {
      e.preventDefault();
      
      // We use FormData to send files + text together
      const formData = new FormData();
      formData.append('title', newRequest.title);
      formData.append('description', newRequest.description);
      // Only append amount if user typed it (otherwise let AI fill it)
      if (newRequest.amount) formData.append('amount', newRequest.amount);
      if (newRequest.file) formData.append('proforma_file', newRequest.file);

      try {
          await api.post('requests/', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          setShowModal(false);
          setNewRequest({ title: '', description: '', amount: '', file: null }); // Reset form
          fetchRequests(); // Refresh data
          alert("Success! Request created. AI is processing...");
      } catch (error) {
          alert("Error creating request. Check console.");
          console.error(error);
      }
  };

  // 4. Handle Approvals
  const handleApprove = async (id) => {
      try {
          await api.patch(`requests/${id}/approve/`);
          fetchRequests(); // Refresh to see new status
      } catch (error) {
          alert("Approval failed");
      }
  };

  const handleReject = async (id) => {
    try {
        await api.patch(`requests/${id}/reject/`);
        fetchRequests(); 
    } catch (error) {
        alert("Rejection failed");
    }
  };

  // 5. Handle Logout
  const handleLogout = () => {
      localStorage.clear();
      navigate('/login');
  };

  // --- SUB-COMPONENTS (VIEWS) ---

  const RequestTable = ({ data, showActions }) => (
    <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '15px'}}>
        <thead>
            <tr style={{borderBottom: '2px solid #eee', color: '#666'}}>
                <th style={{padding: '12px'}}>Title</th>
                <th style={{padding: '12px'}}>Amount</th>
                <th style={{padding: '12px'}}>Status</th>
                {showActions && <th style={{padding: '12px'}}>Actions</th>}
            </tr>
        </thead>
        <tbody>
            {data.map(req => (
                <tr key={req.id} style={{borderBottom: '1px solid #eee'}}>
                    <td style={{padding: '12px', fontWeight: '500'}}>{req.title}</td>
                    <td style={{padding: '12px'}}>${req.amount}</td>
                    <td style={{padding: '12px'}}>
                        <span style={{
                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                            background: req.status === 'APPROVED' ? '#d1fae5' : (req.status === 'REJECTED' ? '#fee2e2' : '#fef3c7'),
                            color: req.status === 'APPROVED' ? '#065f46' : (req.status === 'REJECTED' ? '#991b1b' : '#92400e')
                        }}>
                            {req.status}
                        </span>
                    </td>
                    {showActions && (
                        <td style={{padding: '12px'}}>
                            {req.status === 'PENDING' && (
                                <div style={{display: 'flex', gap: '5px'}}>
                                    <button onClick={() => handleApprove(req.id)} style={{background: '#10b981', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>Approve</button>
                                    <button onClick={() => handleReject(req.id)} style={{background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>Reject</button>
                                </div>
                            )}
                        </td>
                    )}
                </tr>
            ))}
        </tbody>
    </table>
  );

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">IST AFRICA</div>
        <nav>
            <div onClick={() => setCurrentView('dashboard')} className={`nav-link ${currentView==='dashboard'?'active':''}`} style={{cursor: 'pointer'}}>Dashboard</div>
            <div onClick={() => setCurrentView('my_requests')} className={`nav-link ${currentView==='my_requests'?'active':''}`} style={{cursor: 'pointer'}}>My Requests</div>
            <div onClick={() => setCurrentView('approvals')} className={`nav-link ${currentView==='approvals'?'active':''}`} style={{cursor: 'pointer'}}>Approvals</div>
        </nav>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
            <h1>
                {currentView === 'dashboard' && 'Dashboard'}
                {currentView === 'my_requests' && 'My Requests'}
                {currentView === 'approvals' && 'Pending Approvals'}
            </h1>
            
            {/* Admin Profile Area - Clickable */}
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}} onClick={fetchProfile}>
                <span>Welcome, <strong>{user}</strong></span>
                <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
                    {user.charAt(0).toUpperCase()}
                </div>
            </div>
        </div>

        {/* VIEW: DASHBOARD */}
        {currentView === 'dashboard' && (
            <>
                <div className="stats-grid">
                    <div className="card stat-blue">
                        <div className="stat-title">Total Requests</div>
                        <div className="stat-value">{requests.length}</div>
                    </div>
                    <div className="card stat-yellow">
                        <div className="stat-title">Pending</div>
                        <div className="stat-value">{requests.filter(r => r.status === 'PENDING').length}</div>
                    </div>
                    <div className="card stat-green">
                        <div className="stat-title">Approved</div>
                        <div className="stat-value">{requests.filter(r => r.status === 'APPROVED').length}</div>
                    </div>
                </div>

                <div className="card" style={{marginBottom: '30px'}}>
                    <h2 style={{marginBottom: '20px'}}>Quick Actions</h2>
                    <div style={{display: 'flex', gap: '15px'}}>
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                            + New Purchase Request
                        </button>
                        <button className="btn btn-outline" onClick={() => setCurrentView('my_requests')}>
                            View History
                        </button>
                    </div>
                </div>
            </>
        )}

        {/* VIEW: MY REQUESTS (Shows All) */}
        {currentView === 'my_requests' && (
            <div className="card">
                <h2>All Request History</h2>
                <RequestTable data={requests} showActions={false} />
            </div>
        )}

        {/* VIEW: APPROVALS (Shows Pending Only + Buttons) */}
        {currentView === 'approvals' && (
            <div className="card">
                <h2>Requests Needing Approval</h2>
                <RequestTable 
                    data={requests.filter(r => r.status === 'PENDING')} 
                    showActions={true} 
                />
            </div>
        )}

      </main>

      {/* NEW REQUEST MODAL */}
      {showModal && (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>New Purchase Request</h2>
                <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input className="form-input" required 
                            value={newRequest.title} onChange={e => setNewRequest({...newRequest, title: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Amount ($)</label>
                        <input className="form-input" type="number" 
                            placeholder="Leave empty for AI to fill"
                            value={newRequest.amount} onChange={e => setNewRequest({...newRequest, amount: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="form-input" rows="3" required
                             value={newRequest.description} onChange={e => setNewRequest({...newRequest, description: e.target.value})}
                        ></textarea>
                    </div>
                    {/* File Input for AI */}
                    <div className="form-group">
                        <label className="form-label">Upload Proforma (PDF/Image)</label>
                        <input 
                            type="file" 
                            className="form-input"
                            accept=".pdf,.jpg,.png"
                            onChange={e => setNewRequest({...newRequest, file: e.target.files[0]})}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Submit Request</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* ADMIN PROFILE MODAL */}
      {showProfile && userData && (
        <div className="modal-overlay" onClick={() => setShowProfile(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div style={{textAlign: 'center', marginBottom: '20px'}}>
                    <div style={{width: '80px', height: '80px', background: '#2563eb', color: 'white', borderRadius: '50%', fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'}}>
                        {userData.username.charAt(0).toUpperCase()}
                    </div>
                    <h2 style={{marginTop: '10px'}}>{userData.username}</h2>
                    <span style={{background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600'}}>
                        {userData.role}
                    </span>
                </div>
                
                <div style={{background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '10px'}}>
                    <p style={{color: '#64748b', fontSize: '0.9rem'}}>Email</p>
                    <p style={{fontWeight: '500'}}>{userData.email || 'No email set'}</p>
                </div>
                
                <div style={{background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
                    <p style={{color: '#64748b', fontSize: '0.9rem'}}>Date Joined</p>
                    <p style={{fontWeight: '500'}}>{new Date(userData.date_joined).toLocaleDateString()}</p>
                </div>

                <button className="btn" style={{width: '100%', background: '#ef4444', color: 'white'}} onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    )}

    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
export default App;