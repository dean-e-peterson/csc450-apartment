import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';

export default function Notification({
  open,
  onClose,
  notification,
  action,
  authUser,
}) {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={open}
      message={notification}
      onClose={onClose}
      action={action}
    ></Snackbar>
  );
}

Notification.propTypes = {
  open: PropTypes.bool,
};
