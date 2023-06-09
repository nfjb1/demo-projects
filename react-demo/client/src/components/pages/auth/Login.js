import React, { useState, useEffect, useContext, Fragment } from 'react';

import AlertContext from '../../../context/alert/alertContext';
import AuthContext from '../../../context/auth/authContext';

import Alerts from '../../../components/layout/Alerts';

// Material UI
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';

const Login = props => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const authContext = useContext(AuthContext);
  const { login, error, clearErrors, isAuthenticated, token } = authContext;

  const [user, setUser] = useState({
    email: '',
    password: ''
  });
  const { email, password } = user;

  const [waitApi, setWaitApi] = useState({
    waitForApi: false
  });
  const { waitForApi } = waitApi;

  useEffect(() => {
    if (isAuthenticated || token !== null) {
      props.history.push('/');
    }

    if (error === 'Invalid Credentials') {
      setAlert(error, 'danger');
      clearErrors();
      setWaitApi({ waitForApi: false });
    }

    /* eslint-disable-next-line */
  }, [error, isAuthenticated, props.history]);

  const onChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    if (email === '' || password === '') {
      setAlert('Please fill in all fields', 'danger');
    } else {
      setWaitApi({ waitForApi: true });
      login({ email, password });
    }
  };

  const x = () => {};

  return (
    <Fragment>
      <div className='welcome-container'>
        {waitForApi && <LinearProgress color='primary' />}
        <div className='form-container'>
          <h1>
            Account <span className='text-primary'>Login</span>
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
                Login
              </Button>
            </div>
          </FormControl>
          <Alerts />
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
