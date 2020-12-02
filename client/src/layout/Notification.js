import React, { useState } from 'react';
import { Snackbar, makeStyles } from '@material-ui/core';
//import { Alert } from '@material-ui/lab';
import addNotification from 'react-push-notification';

const useStyles = makeStyles((theme) => ({
  root: {
    top: theme.spacing(9),
  },
}));

export default function Notification({ authUser }) {
  const [notify, setNotify] = useState(false);
  const classes = useStyles();

  if (authUser && authUser.isStaff) {
    return (
      <Snackbar
        className={classes.root}
        open={notify.isOpen}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      ></Snackbar>
    );
  } else {
    return <div></div>;
  }
}
