import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import RestaurantDashboard from '../components/RestaurantDashboard';
import ShelterDashboard from '../components/ShelterDashboard';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="dashboard-loading">
        <p className="dashboard-loading-text">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1 className="dashboard-welcome">
          Welcome, {user.orgName  ? user.orgName : user.email}
          {user.orgName ? ` from ${user.orgName}` : ''} ({user.role})
        </h1>
        <button onClick={handleLogout} className="dashboard-logout-btn">
          Logout
        </button>
      </div>

      {user.role === 'restaurant' ? <RestaurantDashboard /> : <ShelterDashboard />}
    </div>
  );
}

export default Dashboard;
