import { useState, useEffect } from 'react';
import './FoodRequestForm.css';

function FoodRequestForm() {
  const [itemName, setItemName] = useState('');
  const [pounds, setPounds] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [shelterId, setShelterId] = useState('');

  // 🍱 Load food items
  useEffect(() => {
    fetch('http://localhost:5001/api/food-items')
      .then((res) => res.json())
      .then((data) => setFoodItems(data))
      .catch((err) => console.error('Failed to load food items:', err));
  }, []);

  // 🧾 Load shelter ID from userMeta stored after login
  useEffect(() => {
    const userMeta = JSON.parse(localStorage.getItem('user'));
    if (userMeta?.role === 'shelter') {
      setShelterId(userMeta.orgId); // 👈 MongoDB ObjectId
    }
  }, []);

  // 📤 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName.trim() || !pounds || !shelterId) return;

    const payload = {
      shelterId,
      food: {
        item: itemName,
        pounds: parseFloat(pounds),
      },
    };

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:5001/api/food-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to submit food request');

      setItemName('');
      setPounds('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error('Error submitting request:', err);
    }
  };

  // 🧠 Select suggestion from dropdown
  const handleSelectItem = (name) => {
    setItemName(name);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="food-request-form">
      <h3 className="form-title">Request Specific Food</h3>
      <div className="form-row">
        <input
          type="text"
          placeholder="Search food item..."
          value={itemName}
          onChange={(e) => {
            setItemName(e.target.value);
            setShowSuggestions(true);
          }}
          className="form-input"
          required
        />

        {itemName && showSuggestions && (
          <ul className="autocomplete-list">
            {foodItems
              .filter((item) =>
                item.name.toLowerCase().includes(itemName.toLowerCase())
              )
              .slice(0, 10)
              .map((item, index) => (
                <li
                  key={index}
                  className="autocomplete-item"
                  onClick={() => handleSelectItem(item.name)}
                >
                  {item.name}
                </li>
              ))}
          </ul>
        )}

        <input
          type="number"
          placeholder="e.g. 10 lbs"
          value={pounds}
          onChange={(e) => setPounds(e.target.value)}
          className="form-input"
          required
        />

        <button type="submit" className="form-submit-btn">Request</button>
      </div>
      {submitted && <p className="form-success">Request posted successfully!</p>}
    </form>
  );
}

export default FoodRequestForm;
