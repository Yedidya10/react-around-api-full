import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from './Menu.js';
import logo from '../images/logo.svg';
import menuIcon from '../images/icons/menu_icon.svg';
import closeIcon from '../images/icons/close_icon.svg';

const Header = ({ loggedIn, email, handleSignout }) => {
  const location = useLocation();
  const isLogin = location.pathname === '/signin';
  const isRegister = location.pathname === '/signup';

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <Menu
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        email={email}
        handleSignout={handleSignout}
      />
      <div className="header__container">
        <img src={logo} className="logo" alt="Around the U.S logo" />
        <nav className="header_nav">
          <ul
            className={`header__links ${
              isLogin || isRegister ? 'header__links_signup-login-page' : ''
            }`}
          >
            {isLogin && (
              <li className="header__link-item">
                <Link to="/signup" className="header__link">
                  Sign up
                </Link>
              </li>
            )}
            {isRegister && (
              <li className="header__link-item">
                <Link to="/signin" className="header__link">
                  Log in
                </Link>
              </li>
            )}
            {loggedIn && (
              <li className="header__link-item">
                <Link
                  to="/signin"
                  className="header__link"
                  onClick={handleSignout}
                >
                  Log out
                </Link>
              </li>
            )}
            {loggedIn && <li className="header__link-item">{email}</li>}
          </ul>
          {!isRegister && !isLogin && (
            <button
              type="button"
              className="header__menu-button"
              onClick={toggleMenu}
            >
              {!isMenuOpen ? (
                <img src={menuIcon} alt="menu" className="header__menu-icon" />
              ) : (
                <img
                  src={closeIcon}
                  alt="close"
                  className="header__close-icon"
                />
              )}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
