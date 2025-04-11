import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import './PostFoodForm.css';

function PostFoodForm() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    item: '',
    pounds: '',
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      pounds: parseFloat(formData.pounds),
      postedBy: currentUser.uid,
      postedByEmail: currentUser.email,
      timestamp: new Date().toISOString(),
    };

    try {
      const token = await currentUser.getIdToken();

      await fetch('http://localhost:5000/api/food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      setFormData({ item: '', pounds: '' });
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
        name="item"
        placeholder="e.g. Tomatoes"
        value={formData.item}
        onChange={handleChange}
        className="form-input"
        required
      />

      <input
        type="number"
        name="pounds"
        placeholder="e.g. 20"
        value={formData.pounds}
        onChange={handleChange}
        className="form-input"
        required
      />

      <button type="submit" className="form-button">
        Post Food
      </button>

      {success && <p className="form-success">Food posted successfully!</p>}
    </form>
  );
}

export default PostFoodForm;
