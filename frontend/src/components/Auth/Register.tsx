import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';
import { RegisterData } from '../../types';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateUsername,
  validateName,
  getPasswordStrength,
  ValidationResult,
  PasswordStrength
} from '../../utils/validation';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fieldValidations, setFieldValidations] = useState<Record<string, ValidationResult>>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateField = (name: string, value: string) => {
    let validation: ValidationResult;

    switch (name) {
      case 'username':
        validation = validateUsername(value);
        break;
      case 'email':
        validation = validateEmail(value);
        break;
      case 'password':
        validation = validatePassword(value);
        setPasswordStrength(getPasswordStrength(value));
        break;
      case 'first_name':
        validation = validateName(value, 'First name');
        break;
      case 'last_name':
        validation = validateName(value, 'Last name');
        break;
      default:
        validation = { isValid: true, message: '' };
    }

    setFieldValidations(prev => ({
      ...prev,
      [name]: validation
    }));

    setFieldErrors(prev => ({
      ...prev,
      [name]: validation.isValid ? '' : validation.message
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    validateField(name, value);

    if (name === 'password' && confirmPassword) {
      const confirmValidation = validateConfirmPassword(value, confirmPassword);
      setFieldValidations(prev => ({
        ...prev,
        confirmPassword: confirmValidation
      }));
      setFieldErrors(prev => ({
        ...prev,
        confirmPassword: confirmValidation.isValid ? '' : confirmValidation.message
      }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    const validation = validateConfirmPassword(formData.password, value);
    setFieldValidations(prev => ({
      ...prev,
      confirmPassword: validation
    }));
    setFieldErrors(prev => ({
      ...prev,
      confirmPassword: validation.isValid ? '' : validation.message
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    const validations = {
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      first_name: validateName(formData.first_name || '', 'First name'),
      last_name: validateName(formData.last_name || '', 'Last name'),
      confirmPassword: validateConfirmPassword(formData.password, confirmPassword)
    };

    const hasErrors = Object.values(validations).some(v => !v.isValid);

    if (hasErrors) {
      setFieldValidations(validations);
      const errors: Record<string, string> = {};
      Object.entries(validations).forEach(([key, validation]) => {
        if (!validation.isValid) {
          errors[key] = validation.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting registration with data:', { ...formData, password: '[HIDDEN]' });
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 0) {
        setError('Unable to connect to server. Please make sure the backend is running on http://localhost:8000');
      } else if (err.message === 'Network Error') {
        setError('Network error. Please check your internet connection and make sure the backend server is running.');
      } else if (err.message) {
        setError(`Registration failed: ${err.message}`);
      } else {
        setError('Registration failed. Please check your connection and try again.');
      }
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
          <Link to="/login" className="auth-nav-link">Sign In</Link>
        </nav>
      </header>

      <div className="auth-content">
        <div className="auth-wrapper">
          <div className="auth-form-section">
            <div className="auth-form-header">
              <h1 className="auth-title">Create your account</h1>
              <p className="auth-subtitle">Join thousands of event organizers who trust our platform to manage their sports events and bookings.</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`form-control ${fieldErrors.username ? 'error' : fieldValidations.username?.isValid ? 'success' : ''}`}
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.username && (
                  <div className="field-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    {fieldErrors.username}
                  </div>
                )}
                {fieldValidations.username?.isValid && (
                  <div className="field-success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    {fieldValidations.username.message}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${fieldErrors.email ? 'error' : fieldValidations.email?.isValid ? 'success' : ''}`}
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.email && (
                  <div className="field-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                    {fieldErrors.email}
                  </div>
                )}
                {fieldValidations.email?.isValid && (
                  <div className="field-success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    {fieldValidations.email.message}
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label htmlFor="first_name" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    className={`form-control ${fieldErrors.first_name ? 'error' : fieldValidations.first_name?.isValid ? 'success' : ''}`}
                    placeholder="Enter your first name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                  {fieldErrors.first_name && (
                    <div className="field-error">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                      </svg>
                      {fieldErrors.first_name}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="last_name" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    className={`form-control ${fieldErrors.last_name ? 'error' : fieldValidations.last_name?.isValid ? 'success' : ''}`}
                    placeholder="Enter your last name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                  {fieldErrors.last_name && (
                    <div className="field-error">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                      </svg>
                      {fieldErrors.last_name}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-control ${fieldErrors.password ? 'error' : fieldValidations.password?.isValid ? 'success' : ''}`}
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {passwordStrength && formData.password && (
                  <div className="password-strength">
                    <div className="password-strength-bar">
                      <div className={`password-strength-fill ${passwordStrength.level}`}></div>
                    </div>
                    <div className="password-requirements">
                      <div className={`password-requirement ${passwordStrength.requirements.length ? 'met' : 'unmet'}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        At least 8 characters
                      </div>
                      <div className={`password-requirement ${passwordStrength.requirements.uppercase ? 'met' : 'unmet'}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        One uppercase letter
                      </div>
                      <div className={`password-requirement ${passwordStrength.requirements.lowercase ? 'met' : 'unmet'}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        One lowercase letter
                      </div>
                      <div className={`password-requirement ${passwordStrength.requirements.number ? 'met' : 'unmet'}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        One number
                      </div>
                      <div className={`password-requirement ${passwordStrength.requirements.special ? 'met' : 'unmet'}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        One special character
                      </div>
                    </div>
                  </div>
                )}
                {fieldErrors.password && (
                  <div className="field-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                    {fieldErrors.password}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-control ${fieldErrors.confirmPassword ? 'error' : fieldValidations.confirmPassword?.isValid ? 'success' : ''}`}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
                {fieldErrors.confirmPassword && (
                  <div className="field-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                    {fieldErrors.confirmPassword}
                  </div>
                )}
                {fieldValidations.confirmPassword?.isValid && (
                  <div className="field-success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    {fieldValidations.confirmPassword.message}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading && <span className="loading-spinner"></span>}
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="auth-link">
              <p>Already have an account?</p>
              <Link to="/login">Sign In</Link>
            </div>
          </div>

          <div className="auth-image-section">
            <svg className="auth-image" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="300" fill="#f8f9fa"/>
              <circle cx="200" cy="150" r="80" fill="#ff6b35" opacity="0.1"/>
              <rect x="160" y="110" width="80" height="80" rx="8" fill="#ff6b35" opacity="0.2"/>
              <path d="M180 130h40v40h-40z" fill="#ff6b35"/>
              <circle cx="190" cy="140" r="4" fill="white"/>
              <circle cx="210" cy="140" r="4" fill="white"/>
              <path d="M185 155h30" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <text x="200" y="220" textAnchor="middle" fill="#6c757d" fontSize="14" fontFamily="system-ui">
                Join Events Community
              </text>
              <text x="200" y="240" textAnchor="middle" fill="#6c757d" fontSize="12" fontFamily="system-ui">
                Manage events, bookings, and teams
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
