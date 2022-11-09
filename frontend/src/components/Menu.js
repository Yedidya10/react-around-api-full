import React from 'react';
import { Link } from 'react-router-dom';

export function Menu(props) {
  const signoutClick = () => {
    props.toggleMenu();
    props.handleSignout();
  };
  return (
    <div
      className={`header__menu ${
        props.isMenuOpen ? 'header__menu_active' : ''
      }`}
    >
      <ul className="header__links header__links_menu">
        <li className="header__link-item">{props.email}</li>
        <li className="header__link-item">
          <Link to="/signin" className="header__link" onClick={signoutClick}>
            Log out
          </Link>
        </li>
      </ul>
    </div>
  );
}
