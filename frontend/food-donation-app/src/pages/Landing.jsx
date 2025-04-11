import { Link } from 'react-router-dom';
import './Landing.css'; // 👈 Don't forget to import the CSS file

function Landing() {
  return (
    <div className="landing-wrapper">
      <div className="landing-card">
        <h1 className="landing-title">Welcome to FoodLink</h1>
        <p className="landing-subtext">
          Bridging restaurants and shelters to fight food waste and feed our communities.
        </p>

        <div className="landing-buttons">
          <Link to="/login">
            <button className="landing-btn yellow">Login</button>
          </Link>
          <Link to="/register">
            <button className="landing-btn green">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;
