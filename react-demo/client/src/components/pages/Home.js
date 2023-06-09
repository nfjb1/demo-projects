import React, { useContext, useEffect } from 'react';
import Contacts from '../contacts/Contacts';

import ContactFilter from '../contacts/ContactFilter';
import ContactForm from '../contacts/ContactForm';

import AuthContext from '../../context/auth/authContext';

// Layout
import Spinner from '../layout/Spinner';

const Home = () => {
  const authContext = useContext(AuthContext);

  const { isAuthenticated, loading } = authContext;

  useEffect(() => {
    authContext.loadUser();
  }, []);

  return (
    <div className='grid-container'>
      {isAuthenticated ? (
        <div className='grid-2-3'>
          <div className='box-left'>
            <ContactForm />
          </div>
          <div className='box-right'>
            <h1>Your Contacts</h1>
            <ContactFilter />
            <Contacts />
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Home;
