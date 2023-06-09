import React, { useEffect, Fragment } from 'react';
import anime from 'animejs';

import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import '../layout/WelcomeCSS.css';
import welcomeBackground from '../layout/welcome-background.svg';

const Welcome = props => {
  useEffect(() => {
    var text = document.getElementsByClassName('ml3')[0];
    var string = 'Keep Your Contacts Safe.';
    string.split('');
    var i = 0,
      length = string.length;
    for (i; i < length; i++) {
      text.innerHTML += "<span class='letter'>" + string[i] + '</span>';
    }

    anime.timeline({ loop: false }).add({
      targets: '.ml3 .letter',
      opacity: [0, 1],
      easing: 'easeInOutQuad',
      duration: 1250,
      delay: function(el, i) {
        return 60 * (i + 1);
      }
    });
  }, []);

  return (
    <Fragment>
      <div
        className='welcome-container'
        style={{
          background: `#ffffff url(${welcomeBackground}) no-repeat center`,
          backgroundSize: '100%'
        }}
      >
        <div className='grid-container'>
          <div style={{ height: '4rem' }} />
          <div className='title'>
            <h1 className='ml3'> </h1>
          </div>

          <div style={{ height: '100px' }} />
          <div className='grid-2-small' style={{ color: '#808080' }}>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
            </div>
            <div>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum. Lorem ipsum dolor sit amet.
            </div>
          </div>

          <div style={{ height: '4rem' }} />
          <div
            style={{
              backgroundColor: '#cccccc',
              height: '0.2rem',
              width: '11rem',
              borderRadius: '2px',
              margin: 'auto',
              textAlign: 'center'
            }}
          />
          <div style={{ height: '2rem' }} />
          <div className='welcome-quote'>
            “Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident.”
          </div>

          <div style={{ height: '4rem' }} />
          <div className='grid-2'>
            <div
              style={{
                textAlign: 'right'
              }}
            >
              <Link to='/login'>
                <Button variant='contained' className='btn btn-light'>
                  Login
                </Button>
              </Link>
            </div>
            <div
              style={{
                textAlign: 'left'
              }}
            >
              <Link to='/welcome/register'>
                <Button variant='contained' className='btn btn-orange'>
                  Register Now
                </Button>
              </Link>
            </div>

            <div style={{ height: '1rem' }} />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Welcome;
