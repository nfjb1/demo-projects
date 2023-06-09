import React, { useContext, Fragment } from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Layout
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCardAlt } from '@fortawesome/free-solid-svg-icons';

import AuthContext from '../../context/auth/authContext';

import ContactContext from '../../context/contact/contactContext';

const Navbar = ({ pathname }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout, user } = authContext;

  const contactContext = useContext(ContactContext);
  const { clearContacts } = contactContext;

  const defaultProfilePicture = '/default.jpg';

  const onLogout = () => {
    logout();
    clearContacts();
  };

  const showDropdown = () => {
    document.getElementsByClassName(
      'navbar-dropdown-menu-popup'
    )[0].style.display = 'block';
  };
  const hideDropdown = () => {
    document.getElementsByClassName(
      'navbar-dropdown-menu-popup'
    )[0].style.display = 'none';
  };

  const normalNavbar = (
    <div className='navbar' onBlur={hideDropdown}>
      <div className='content-left'>
        <ul>
          <li style={{ fontSize: '2rem', marginRight: '2rem' }}>
            <FontAwesomeIcon icon={faIdCardAlt} />
          </li>
          <li>
            <Link to='/' style={{ color: '#999999' }}>
              Home
            </Link>
          </li>
          <li>
            <Link to='/about'>About</Link>
          </li>
        </ul>
      </div>
      <div
        className='content-right'
        onClick={showDropdown}
        style={{ cursor: 'pointer' }}
      >
        <div style={{ display: 'contents' }}>
          <div className='profile-image-wrapper'>
            <img
              src={user !== null ? user.profilePicture : defaultProfilePicture}
              style={{
                borderRadius: '50%',
                height: '100%',
                width: '100%'
              }}
              alt={user ? 'User' : null}
            />
          </div>{' '}
          {user !== null ? user.name : '...'}
        </div>
        <div
          className='navbar-dropdown-menu-popup'
          style={{
            display: 'none'
          }}
        >
          <ul style={{ display: 'block' }}>
            <li style={{ padding: '0.25rem 0' }}>
              <Link to='/profile'>My Profile</Link>
            </li>
            <li style={{ padding: '0.25rem 0' }}>
              <Link onClick={onLogout} to='#!'>
                <i className='fas fa-sign-out-alt' /> Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const welcomeNavbar = (
    <div className='welcome-navbar'>
      <ul>
        <li style={{ fontSize: '2rem', marginRight: '' }}>
          <FontAwesomeIcon icon={faIdCardAlt} />
        </li>
      </ul>
      <ul />
      <div>
        <ul>
          <li>
            <Link to='/about'>About</Link>
          </li>
          <li>
            <Link to='/welcome/register'>Register</Link>
          </li>
          <li>
            <Link to='/login'>Login</Link>
          </li>
        </ul>
      </div>
    </div>
  );

  const clearNavbar = (
    <div className='welcome-navbar'>
      <ul />
      <ul>
        <Link to='/'>
          <li style={{ fontSize: '2rem', marginRight: '' }}>
            <FontAwesomeIcon icon={faIdCardAlt} />
          </li>
        </Link>
      </ul>
      <ul />
    </div>
  );

  return (
    <Fragment>
      {pathname === '/about'
        ? clearNavbar
        : isAuthenticated
        ? normalNavbar
        : welcomeNavbar}
    </Fragment>
  );
};

export default Navbar;
