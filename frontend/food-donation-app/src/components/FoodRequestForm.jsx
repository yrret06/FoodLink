import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import './FoodRequestForm.css';

function FoodRequestForm() {
  const { currentUser } = useAuth();
  const [itemName, setItemName] = useState('');
  const [pounds, setPounds] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    const requestPayload = {
      item: itemName,
      pounds: parseFloat(pounds) || 0,
      requestedBy: currentUser.uid,
      requestedByEmail: currentUser.email,
      timestamp: new Date().toISOString(),
    };

    console.log('Food request payload:', requestPayload);

    setItemName('');
    setPounds(0);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="food-request-form">
      <h3 className="form-title">Request Specific Food</h3>
      <div className="form-row">
        <input
          type="text"
          placeholder="e.g. Rice, Tomatoes..."
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="form-input"
        />
        <input
          type="number"
          placeholder="e.g. 10 lbs"
          value={pounds}
          onChange={(e) => setPounds(e.target.value)}
          className="form-input"
        />
        <button type="submit" className="form-submit-btn">
          Request
        </button>
      </div>
      {submitted && <p className="form-success">Request logged in console!</p>}
    </form>
  );
}

export default FoodRequestForm;
