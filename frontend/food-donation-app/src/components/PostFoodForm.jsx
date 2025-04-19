import { useState, useEffect } from 'react';
import './PostFoodForm.css';

function PostFoodForm() {
  const [formData, setFormData] = useState({ foodItem: '', pounds: '', priority: 'Medium' });
  const [success, setSuccess] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5001/api/food-items')
      .then(res => res.json())
      .then(data => setFoodItems(data))
      .catch(err => console.error('Failed to load food items:', err));
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.role === 'restaurant') {
      setRestaurantId(storedUser.orgId);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'foodItem') {
      setShowSuggestions(true);
    }
  };

  const handleSelectItem = (itemName) => {
    setFormData(prev => ({ ...prev, foodItem: itemName }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const payload = {
      restaurantId,
      items: [
        {
          foodItem: formData.foodItem,
          pounds: parseFloat(formData.pounds),
        },
      ],
      priority: formData.priority,
    };

    try {
      const res = await fetch('http://localhost:5001/api/food-postings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to post food');

      setFormData({ foodItem: '', pounds: '', priority: 'Medium' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error posting food:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h3 className="form-title">Post Available Food</h3>

      <input
        type="text"
        name="foodItem"
        placeholder="Search food item..."
        value={formData.foodItem}
        onChange={handleChange}
        className="form-input"
        required
      />

      {formData.foodItem && showSuggestions && (
        <ul className="autocomplete-list">
          {foodItems
            .filter(f => f.name.toLowerCase().includes(formData.foodItem.toLowerCase()))
            .slice(0, 10)
            .map((f, idx) => (
              <li
                key={idx}
                className="autocomplete-item"
                onClick={() => handleSelectItem(f.name)}
              >
                {f.name}
              </li>
            ))}
        </ul>
      )}

      <input
        type="number"
        name="pounds"
        placeholder="e.g. 20"
        value={formData.pounds}
        onChange={handleChange}
        className="form-input"
        required
      />

      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className="form-input"
      >
        <option value="High">High Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="Low">Low Priority</option>
      </select>

      <button type="submit" className="form-button">Post Food</button>
      {success && <p className="form-success">Food posted successfully!</p>}
    </form>
  );
}

export default PostFoodForm;
