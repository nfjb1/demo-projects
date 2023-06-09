import React, { useState, useContext, Fragment, useEffect } from 'react';
import AlertContext from '../../../context/alert/alertContext';
import AuthContext from '../../../context/auth/authContext';

// Material UI
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';

import Alerts from '../../../components/layout/Alerts';

const Register = props => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const authContext = useContext(AuthContext);
  const { register, error, clearErrors, isAuthenticated, token } = authContext;

  useEffect(() => {
    if (isAuthenticated || token !== null) {
      props.history.push('/');
    }

    if (error === 'User already exists') {
      setAlert(error, 'danger');
      clearErrors();
    }
    /* eslint-disable-next-line */
  }, [error, isAuthenticated, props.history]);

  const [waitApi, setWaitApi] = useState({
    waitForApi: false
  });

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    profilePicture: ''
  });
  const { name, email, password, password2, profilePicture } = user;

  const x = () => {};

  const onChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();

    if (name === '' || email === '' || password === '') {
      setAlert('Please Enter All Fields', 'danger');
    } else if (password !== password2) {
      setAlert('Passwords not mataching', 'danger');
    } else {
      setWaitApi({ waitForApi: true });
      register({
        name,
        email,
        password,
        profilePicture
      });
    }
  };

  return (
    <Fragment>
      <div className='welcome-container'>
        {waitApi.waitForApi && <LinearProgress />}
        <div className='form-container'>
          <h1>
            Account <span className='text-primary'>Register</span>
          </h1>

          <FormControl
            // onSubmit={onSubmit}
            onKeyUp={e => {
              if (e.keyCode === 13) {
                // Simulate click on submi
                document.getElementsByClassName('btn-orange')[0].focus();
                setTimeout(() => {
                  document.getElementsByClassName('btn-orange')[0].blur();
                }, 0);
                // Submit when pressing enter
                onSubmit(e);
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
              onFocus={x}
              onBlur={x}
              required
            />
            <TextField
              className='contact-form-input'
              label='Email Address'
              type='email'
              name='email'
              value={email}
              onChange={onChange}
              onFocus={x}
              onBlur={x}
              required
            />
            <TextField
              className='contact-form-input'
              label='Password'
              type='password'
              name='password'
              value={password}
              onChange={onChange}
              onFocus={x}
              onBlur={x}
              required
              minLength='6'
            />
            <TextField
              className='contact-form-input'
              label='Confirm Password'
              type='password'
              name='password2'
              value={password2}
              onChange={onChange}
              onFocus={x}
              onBlur={x}
              required
              minLength='6'
            />

            <div style={{ margin: '1rem 0 0.85rem 0' }} />
            <div style={{ float: 'right' }}>
              <Button
                type='submit'
                variant='contained'
                style={{ float: 'right' }}
                onClick={onSubmit}
                className='btn btn-orange'
              >
                Register
              </Button>
            </div>
          </FormControl>
          <Alerts />
        </div>
      </div>
    </Fragment>
  );
};

export default Register;
