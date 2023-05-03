import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Menu } from './Menu.js';
import logo from '../images/logo.svg';
import menuIcon from '../images/icons/menu_icon.svg';
import closeIcon from '../images/icons/close_icon.svg';


const Header = ({ isLoggedIn, email, handleSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();
  const isLoginPage = location.pathname === '/signin';
  const isRegisterPage = location.pathname === '/signup';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <Menu
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        email={email}
        handleSignOut={handleSignOut}
      />
      <div className="header__container">
        <img src={logo} className="logo" alt="Around the U.S logo" />
        <nav className="header_nav">
          <ul
            className={`header__links ${isLoginPage || isRegisterPage ? 'header__links_signup-login-page' : ''
              }`}
          >
            {isLoginPage && (
              <li className="header__link-item">
                <Link to="/signup" className="header__link">
                  Sign up
                </Link>
              </li>
            )}
            {isRegisterPage && (
              <li className="header__link-item">
                <Link to="/signin" className="header__link">
                  Log in
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <>
                <li className="header__link-item">
                  <Link
                    to="/signin"
                    className="header__link"
                    onClick={handleSignOut}
                  >
                    Log out
                  </Link>
                </li>
                <li className="header__link-item">{email}</li>
              </>
            )}
          </ul>
          {!isRegisterPage && !isLoginPage && (
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
