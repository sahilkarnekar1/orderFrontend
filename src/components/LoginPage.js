import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styling/Login.css";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';  // Import Redux dispatch
import { login } from '../redux/authSlice'; // Import login action

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize Redux dispatch
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
useEffect(()=>{
if (isAuthenticated) {
  navigate("/dashboard");
}
})
  const [formData, setFormData] = useState({
    emailShop: '',
    passwordShop: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://order-backend-olive.vercel.app/api/shopPartnerAuth/login-shop', formData);
      const token = res.data.token;

      // Dispatch Redux login action
      dispatch(login(token));

      toast.success("User Login Successfully");

      // Navigate to the dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
      toast.error("Error occurred");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Shop Login</h2>
        {error && <p className="error-msg">{error}</p>}
        <input
          type="email"
          name="emailShop"
          placeholder="Email"
          value={formData.emailShop}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="passwordShop"
          placeholder="Password"
          value={formData.passwordShop}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
