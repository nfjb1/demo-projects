import React from 'react';

import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <ul />
      <ul>
        <li>
          This is a demo project, do not enter real data -{' '}
          <Link to='/about'>More information</Link>
        </li>
      </ul>
      <ul />
    </footer>
  );
};

export default Footer;
