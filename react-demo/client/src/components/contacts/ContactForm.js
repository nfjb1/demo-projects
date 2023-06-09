import React, { useState, useContext, useEffect, Fragment } from 'react';
import ContactContext from '../../context/contact/contactContext';

// Material UI
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const ContactForm = () => {
  // Declerations
  const contactContext = useContext(ContactContext);

  const {
    addContact,
    current,
    clearCurrent,
    updateContact,
    clearFilter
  } = contactContext;

  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'personal'
  });

  const { name, email, phone, type } = contact;

  // Front End

  const boxActive = () => {
    document.getElementsByClassName('box-left')[0].classList.add('box-active');

    document
      .getElementsByClassName('box-right')[0]
      .classList.remove('box-active');
  };

  const boxNotActive = () => {
    document
      .getElementsByClassName('box-left')[0]
      .classList.remove('box-active');
  };

  // Back end

  const onChange = e =>
    setContact({ ...contact, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (current === null) {
      addContact(contact);

      document.getElementById('contact-filter').value = '';
    } else {
      updateContact(contact);

      document.getElementById('contact-filter').value = '';
    }

    clearAll();
    clearFilter();
    clearCurrent();

    document.getElementsByClassName('box-right')[0].classList.add('box-active');
  };

  useEffect(() => {
    if (current !== null) {
      setContact(current);
    } else {
      setContact({
        name: '',
        email: '',
        phone: '',
        type: 'personal'
      });
    }
  }, [contactContext, current]);

  const clearAll = () => {
    document.getElementById('contact-filter').value = '';
    clearCurrent();
    setContact({
      name: '',
      email: '',
      phone: '',
      type: 'personal'
    });
  };

  return (
    <Fragment>
      <h1 style={{ fontSize: '2.5rem' }}>
        {current === null ? 'Add Contact' : 'Edit Contact'}
      </h1>
      <FormControl
        onKeyUp={e => {
          if (e.keyCode === 13) {
            // Simulate click on submit
            document.getElementsByClassName('btn-orange')[0].click();
            document.getElementsByClassName('btn-orange')[0].focus();
            setTimeout(() => {
              document.getElementsByClassName('btn-orange')[0].blur();
            }, 0);
          }
        }}
        style={{ width: '100%' }}
      >
        <TextField
          className='contact-form-input'
          label='Name'
          type='text'
          name='name'
          value={name}
          onChange={onChange}
          onFocus={boxActive}
          onBlur={boxNotActive}
        />
        <TextField
          className='contact-form-input'
          label='Email'
          type='text'
          name='email'
          value={email}
          onChange={onChange}
          onFocus={boxActive}
          onBlur={boxNotActive}
        />
        <TextField
          className='contact-form-input'
          label='Phone'
          type='text'
          name='phone'
          value={phone}
          onChange={onChange}
          onFocus={boxActive}
          onBlur={boxNotActive}
        />
        <div style={{ margin: '1rem 0 0.85rem 0' }} />
        <FormLabel>Contact Type</FormLabel>

        <div style={{ margin: '0rem 0 0.2rem 0' }} />
        <RadioGroup row>
          <FormControlLabel
            control={<Radio color='primary' />}
            label='Personal'
            labelPlacement='end'
            name='type'
            value='personal'
            onChange={onChange}
            checked={type === 'personal'}
            onFocus={boxActive}
            onBlur={boxNotActive}
          />
          <FormControlLabel
            control={<Radio color='primary' />}
            label='Professional'
            labelPlacement='end'
            name='type'
            value='professional'
            onChange={onChange}
            checked={type === 'professional'}
            onFocus={boxActive}
            onBlur={boxNotActive}
          />
        </RadioGroup>

        <div style={{ margin: '1rem 0 0.85rem 0' }} />
        <div style={{ float: 'right' }}>
          <Button
            type='submit'
            variant='contained'
            style={{ float: 'right' }}
            onClick={onSubmit}
            className='btn btn-orange'
          >
            {current === null ? 'Add Contact' : 'Save'}
          </Button>
        </div>
        {current && (
          <Button
            type='submit'
            className='btn btn-light'
            style={{ float: 'right' }}
            variant='contained'
            onClick={clearAll}
          >
            Cancel
          </Button>
        )}
      </FormControl>
    </Fragment>
  );
};

export default ContactForm;
