import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import CircularProgress from '@material-ui/core/CircularProgress';

const Spinner = () => {
  return (
    <Fragment>
      <div style={{ padding: '2rem 0' }}>
        <p style={{ textAlign: 'center' }}>Waiting for API callback...</p>
        <div style={{ height: '1rem' }} />
        <h1 style={{ textAlign: 'center' }}>
          <CircularProgress />
        </h1>
      </div>
    </Fragment>
  );
};

export default Spinner;
