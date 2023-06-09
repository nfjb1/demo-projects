import React, { Fragment, useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import { PropsRoute, PublicRoute, PrivateRoute } from 'react-router-with-props';

// Pages
import Home from './components/pages/Home';
import About from './components/pages/About';
import Register from './components/pages/auth/Register';
import Login from './components/pages/auth/Login';
import Welcome from './components/pages/Welcome';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
// import Alerts from './components/layout/Alerts';
import './App.css';

// States
import ContactState from './context/contact/ContactState';
import AuthtState from './context/auth/AuthState';
import AlertState from './context/alert/AlertState';

// UI
import posed, { PoseGroup } from 'react-pose';
import setAuthToken from './utils/setAuthToken';

// Route
import PrivateRoute from './components/routing/PrivatRoute';

// TEMP
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const RouteContainer = posed.div({
  enter: {
    y: 0,
    opacity: 1,
    delay: 350,
    transition: {
      ease: 'easeIn',
      default: { duration: 300 }
    }
  },
  exit: {
    y: 50,
    opacity: 0,
    transition: { ease: 'easeOut', duration: 300 }
  }
});

const App = () => {
  // Title change

  const [firstTime, setFirstTime] = useState({ firstVisit: null });
  const [open, setOpen] = useState(true);

  const { firstVisit } = firstTime;

  const visited = localStorage['alreadyVisited'];

  // Title should change every 1 second(s)
  const secondsBetweenChange = 2;

  useEffect(() => {
    const currentTitle = document.title;

    setInterval(function() {
      document.title = `Demo Project`;
      setTimeout(function() {
        document.title = currentTitle;
      }, secondsBetweenChange * 1000);
    }, secondsBetweenChange * 1000 * 2);

    if (visited) {
      setFirstTime({ firstVisit: false });
    } else {
      setFirstTime({ firstVisit: true });
      localStorage['alreadyVisited'] = true;
    }
    console.log(firstTime);
  }, []);

  const closeFirstTimeInfo = () => {
    setOpen(false);
  };

  return (
    <AuthtState>
      <ContactState>
        <AlertState>
          <Router>
            <Route
              render={({ location }) => (
                <Fragment>
                  {firstVisit && (
                    <Fragment>
                      <Dialog onClose={closeFirstTimeInfo} open={open}>
                        <DialogTitle>Demo Project</DialogTitle>
                        <DialogContent dividers>
                          <Typography gutterBottom>
                            Cras mattis consectetur purus sit amet fermentum.
                            Cras justo odio, dapibus ac facilisis in, egestas
                            eget quam. Morbi leo risus, porta ac consectetur ac,
                            vestibulum at eros.
                          </Typography>
                          <Typography gutterBottom>
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Vivamus sagittis lacus vel augue
                            laoreet rutrum faucibus dolor auctor.
                          </Typography>
                          <Typography gutterBottom>
                            Aenean lacinia bibendum nulla sed consectetur.
                            Praesent commodo cursus magna, vel scelerisque nisl
                            consectetur et. Donec sed odio dui. Donec
                            ullamcorper nulla non metus auctor fringilla.
                          </Typography>
                        </DialogContent>

                        <DialogActions>
                          <Button onClick={closeFirstTimeInfo} color='primary'>
                            Alright!
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Fragment>
                  )}
                  <Navbar pathname={location.pathname} />
                  <div className='full-width-container'>
                    <PoseGroup>
                      <RouteContainer key={location.pathname}>
                        {/* <Alerts /> */}
                        <Switch location={location}>
                          <PrivateRoute exact path='/' component={Home} />
                          <Route exact path='/about' component={About} />
                          <Route exact path='/login' component={Login} />
                          <Route
                            exact
                            path='/welcome'
                            component={props => (
                              <Welcome {...props} open={open} />
                            )}
                          />
                          <Route
                            exact
                            path='/welcome/register'
                            component={Register}
                          />
                        </Switch>
                        <Footer />
                      </RouteContainer>
                    </PoseGroup>
                  </div>
                </Fragment>
              )}
            />
          </Router>
        </AlertState>
      </ContactState>
    </AuthtState>
  );
};

export default App;
