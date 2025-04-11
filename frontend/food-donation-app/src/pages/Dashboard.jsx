import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import RestaurantDashboard from '../components/RestaurantDashboard';
import ShelterDashboard from '../components/ShelterDashboard';
import './Dashboard.css'; // ✅ Import your CSS

function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [orgName, setOrgName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setRole(data.role);
            setOrgName(data.orgId);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [currentUser]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (!currentUser || loading) {
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
          Welcome, {currentUser.email}
          {orgName ? ` from ${orgName}` : ''} ({role})
        </h1>
        <button onClick={handleLogout} className="dashboard-logout-btn">
          Logout
        </button>
      </div>

      {role === 'restaurant' ? <RestaurantDashboard /> : <ShelterDashboard />}
    </div>
  );
}

export default Dashboard;
