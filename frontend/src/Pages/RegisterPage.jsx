import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Simple validations
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div>
      <Navbar />
      <section className="flex flex-col items-center justify-center min-h-screen bg-[#f9f6ff] px-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-left mb-1 font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border rounded px-4 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-left mb-1 font-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border rounded px-4 py-2"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-left mb-1 font-semibold">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full border rounded px-4 py-2"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700 text-white py-2 rounded-full font-semibold hover:bg-purple-600"
            >
              Register
            </button>
          </form>
          <div className="mt-6">
            <button
              className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded-full font-semibold hover:bg-red-600"
            >
              <svg
                className="h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.69 1.17 9.33 3.1l7.14-7.14C36.41 2.08 30.52 0 24 0 14.46 0 6.07 5.42 2.24 13.31l8.34 6.48C12.95 14.66 18.01 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.35 24.33c0-1.63-.14-3.2-.41-4.73H24v9.15h12.65c-.55 2.92-2.22 5.39-4.67 7.05l7.24 5.62c4.21-3.89 6.63-9.62 6.63-16.09z"
                />
                <path
                  fill="#4A90E2"
                  d="M11.59 28.23l-8.34-6.48C2.42 24.41 2 26.17 2 28c0 3.2 1.07 6.14 2.85 8.51l8.74-6.79z"
                />
                <path
                  fill="#FBBC05"
                  d="M24 48c6.63 0 12.16-2.18 16.21-5.96l-7.24-5.62c-2.46 1.7-5.56 2.71-8.97 2.71-5.98 0-11.05-4.18-12.77-9.76l-8.74 6.79C6.11 42.57 14.61 48 24 48z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default RegisterPage;
