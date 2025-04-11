import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // ✅ Import the CSS file

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

  useEffect(() => {
    fetch('https://run.mocky.io/v3/f61c280e-bea1-4d49-8455-d615ddd193bd')
      .then((res) => res.json())
      .then((data) => setOrganizations(data))
      .catch((err) => console.error('Failed to load orgs', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'orgId') {
      const selectedOrg = organizations.find((org) => org.id === value);
      if (selectedOrg) {
        setFormData((prev) => ({
          ...prev,
          orgId: selectedOrg.id,
          orgName: selectedOrg.name,
          role: selectedOrg.type,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.orgId) {
      alert('Please select a valid organization.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: formData.email,
        role: formData.role,
        orgId: formData.orgId,
        orgName: formData.orgName,
      });

      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.message);
      alert(error.message);
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
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="register-input"
          onChange={handleChange}
          required
        />

        <select
          name="orgId"
          value={formData.orgId}
          onChange={handleChange}
          className="register-select"
          required
        >
          <option value="">Select your organization</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name} ({org.type})
            </option>
          ))}
        </select>

        <button type="submit" className="register-button">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
