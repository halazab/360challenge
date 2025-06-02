import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';
import { LoginData } from '../../types';
import { validateEmail, ValidationResult } from '../../utils/validation';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear field errors when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Basic validation
    const errors: Record<string, string> = {};

    if (!formData.username) {
      errors.username = 'Username or email is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <header className="auth-header">
        <Link to="/" className="auth-logo">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.09-.21 2.28-.71 3.33-1.36.51-.31.97-.66 1.39-1.06.21-.2.4-.4.58-.62.37-.42.71-.87 1.01-1.35.59-.94 1.07-1.96 1.42-3.05.18-.55.33-1.12.44-1.69.06-.3.11-.6.15-.91.03-.21.05-.43.06-.65.01-.11.01-.22.01-.33V7L12 2z"/>
          </svg>
          <span className="auth-logo-text">Events</span>
        </Link>
        <nav className="auth-nav">
          <Link to="/register" className="auth-nav-link">Sign Up</Link>
        </nav>
      </header>

      <div className="auth-content">
        <div className="auth-wrapper">
          <div className="auth-form-section">
            <div className="auth-form-header">
              <h1 className="auth-title">Welcome back</h1>
              <p className="auth-subtitle">Sign in to your account to access your sports events and manage your bookings.</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username or Email
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`form-control ${fieldErrors.username ? 'error' : ''}`}
                  placeholder="Enter your username or email"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.username && (
                  <div className="field-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                    {fieldErrors.username}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-control ${fieldErrors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.password && (
                  <div className="field-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                    {fieldErrors.password}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading && <span className="loading-spinner"></span>}
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="auth-link">
              <p>Don't have an account?</p>
              <Link to="/register">Create Account</Link>
            </div>
          </div>

          <div className="auth-image-section">
            <svg className="auth-image" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="300" fill="#f8f9fa"/>
              <circle cx="200" cy="150" r="100" fill="#ff6b35" opacity="0.1"/>
              <rect x="150" y="100" width="100" height="100" rx="12" fill="#ff6b35" opacity="0.2"/>
              <path d="M170 120h60v60h-60z" fill="#ff6b35"/>
              <circle cx="185" cy="135" r="6" fill="white"/>
              <circle cx="215" cy="135" r="6" fill="white"/>
              <path d="M175 160h50" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <text x="200" y="230" textAnchor="middle" fill="#6c757d" fontSize="16" fontFamily="system-ui">
                Welcome Back to Events
              </text>
              <text x="200" y="250" textAnchor="middle" fill="#6c757d" fontSize="12" fontFamily="system-ui">
                Your sports events are waiting for you
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
