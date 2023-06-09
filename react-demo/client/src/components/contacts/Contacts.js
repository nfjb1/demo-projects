import React, { Fragment, useContext, useEffect, useState } from 'react';
import ContactItem from './ContactItem';
import ContactContext from '../../context/contact/contactContext';

import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Spinner from '../layout/Spinner';

const Contacts = () => {
  const contactContext = useContext(ContactContext);

  const { contacts, filtered, getContacts, loading } = contactContext;

  useEffect(() => {
    getContacts();
  }, []);

  if (contacts !== null && contacts.length === 0 && !loading) {
    return (
      <p className='information'>Add contacts with the section on the left</p>
    );
  }

  return (
    <Fragment>
      {contacts !== null && !loading ? (
        <TransitionGroup>
          {!filtered
            ? contacts.map(contact => (
                <CSSTransition
                  key={contact._id}
                  timeout={500}
                  classNames='item'
                >
                  <ContactItem key={contact._id} contact={contact} />
                </CSSTransition>
              ))
            : filtered.map(contact => (
                <CSSTransition
                  key={contact._id}
                  timeout={500}
                  classNames='item'
                >
                  <ContactItem key={contact._id} contact={contact} />
                </CSSTransition>
              ))}
        </TransitionGroup>
      ) : (
        <div>
          <Spinner />
        </div>
      )}
    </Fragment>
  );
};

export default Contacts;
