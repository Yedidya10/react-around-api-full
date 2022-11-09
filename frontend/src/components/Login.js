import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from '../utils/hooks/useForm';

const Login = ({ handleLogin, isLoading }) => {
  const { values, handleChange } = useForm({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = values;
    handleLogin({ email, password });
  };

  return (
    <div className="auth-form">
      <h2 className="auth-form__title">Log in</h2>
      <form className="auth-form__form" onSubmit={handleSubmit}>
        <div className="auth-form__inputs">
          <input
            type="email"
            name="email"
            className="auth-form__input"
            placeholder="Email"
            value={values.email || ''}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            className="auth-form__input"
            placeholder="Password"
            value={values.password || ''}
            onChange={handleChange}
          />
        </div>
        <div className="auth-form__submit-wrapper">
          <button type="submit" className="auth-form__submit-button">
            {isLoading ? 'Logging In...' : 'Log in'}
          </button>
          <p className="auth-form__submit-text">
            Not a member yet?{' '}
            <Link to="/signup" className="auth-form__submit-link">
              Sign up here!
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
