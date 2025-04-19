import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    orgId: '',
    orgName: '',
    role: '',
  });
  const [error, setError] = useState('');

  // Fetch organization list based on role
  useEffect(() => {
    if (!formData.role) return;

    const endpoint =
      formData.role === 'Restaurant'
        ? 'http://localhost:5001/api/restaurants'
        : 'http://localhost:5001/api/shelters';

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => setOrganizations(data))
      .catch((err) => console.error('Failed to load orgs:', err));
  }, [formData.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'role') {
      setOrganizations([]);
      setFormData((prev) => ({ ...prev, orgId: '', orgName: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.orgId) {
      alert('Please select a valid organization from the dropdown.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          orgId: formData.orgId,
          role: formData.role.toLowerCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Registration failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      alert('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err.message);
      setError(err.message);
    }
  };

  return (
    <div className="register-wrapper">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-title">Register</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="register-input"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="register-input"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="role-select-group">
          <label>
            <input
              type="radio"
              name="role"
              value="Restaurant"
              checked={formData.role === 'Restaurant'}
              onChange={handleChange}
            />
            Restaurant
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="Shelter"
              checked={formData.role === 'Shelter'}
              onChange={handleChange}
            />
            Shelter
          </label>
        </div>

        {formData.role && (
          <div className="autocomplete-container">
            <input
              type="text"
              placeholder={`Search your ${formData.role.toLowerCase()}`}
              value={formData.orgName}
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  orgName: value,
                  orgId: '',
                }));
              }}
              className="register-input"
              required
            />

            {formData.orgName && organizations.length > 0 && (
              <ul className="autocomplete-list">
                {organizations
                  .filter((org) =>
                    org.name.toLowerCase().includes(formData.orgName.toLowerCase())
                  )
                  .slice(0, 10)
                  .map((org) => (
                    <li
                      key={org._id}
                      className="autocomplete-item"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          orgId: org._id,
                          orgName: org.name,
                        }));
                        setOrganizations([]); // Hide dropdown
                      }}
                    >
                      {org.name}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )}

        {error && <p className="register-error">{error}</p>}

        <button type="submit" className="register-button">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
