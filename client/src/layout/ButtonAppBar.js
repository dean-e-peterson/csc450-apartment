import React, { Fragment, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AppBar, Button, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { getAppEditing, setAppEditing } from "../utils/EditingHandler";
import Notification from "../layout/Notification";

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  },
  titleLink: {
    color: "white",
    textDecoration: "none"
  }
}));

const confirmLogoutMessage =
  "You are about to log out, but the page you are editing may contain changes.  Do you wish to log out?";

const ButtonAppBar = ({ authUser, setAuthUser }) => {
  const classes = useStyles();
  const history = useHistory();
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: ""
  });

  const onLogout = () => {
    // If user is editing, prompt to confirm first.
    if (getAppEditing() > 0) {
      if (!window.confirm(confirmLogoutMessage)) {
        return;
      }
    }
    setAuthUser(null);
    localStorage.removeItem("token");

    // Don't prompt for confirmation again just because we are leaving the page.
    setAppEditing(0);

    // Back to homepage in case user no longer has rights to where they were.
    history.push("/");
  };

  const onChatInit = () => {
    setNotify({
      isOpen: true,
      message: "Chat has been initiated",
      type: "info"
    });
  };

  // Choose buttons to display based on permissions of logged on user.
  let buttons;
  if (!authUser) {
    // Not logged in.
    buttons = (
      <Fragment>
        <Button color='inherit' component={Link} to='/login'>
          Login
        </Button>
        <Button color='inherit' component={Link} to='/register'>
          Register
        </Button>
        <Button
          color='inherit'
          onClick={onChatInit}
          component={Link}
          to='/join'
        >
          Chat
        </Button>
      </Fragment>
    );
  } else if (authUser.isStaff) {
    // Logged in as staff.
    buttons = (
      <Fragment>
        <Button color='inherit' onClick={onLogout}>
          Logout
        </Button>
        <Button color='inherit' component={Link} to='/posts'>
          Bulletin Board
        </Button>
        <Button color='inherit' component={Link} to='/maintenance'>
          Maintenance
        </Button>
        <Button color='inherit' component={Link} to='/calendar'>
          Calendar
        </Button>
        <Button color='inherit' component={Link} to='/applications'>
          Applications
        </Button>
        <Button color='inherit' component={Link} to='/users'>
          Users
        </Button>
        <Button color='inherit' component={Link} to='/units'>
          Units
        </Button>
        <Button color='inherit' component={Link} to='/join'>
          Join
        </Button>
      </Fragment>
    );
  } else if (authUser.unit) {
    // Logged in as tenant.
    buttons = (
      <Fragment>
        <Button color='inherit' onClick={onLogout}>
          Logout
        </Button>
        <Button color='inherit' component={Link} to='/posts'>
          Bulletin Board
        </Button>
        <Button color='inherit' component={Link} to='/maintenance'>
          Maintenance
        </Button>
        <Button color='inherit' component={Link} to='/calendar'>
          Calendar
        </Button>
        <Button color='inherit' component={Link} to='/join'>
          Chat
        </Button>
      </Fragment>
    );
  } else {
    // Logged in as but not as tenant or staff.
    buttons = (
      <Fragment>
        {authUser && authUser.applications.length > 0 && (
          <Button color='inherit' component={Link} to='/apply'>
            My Application
          </Button>
        )}
        <Button color='inherit' onClick={onLogout}>
          Logout
        </Button>
        <Button color='inherit' component={Link} to='/join'>
          Chat
        </Button>
      </Fragment>
    );
  }

  return (
    <AppBar position='fixed'>
      <Toolbar>
        <Link to='/'>
          <img src='images/logo.svg' alt='Home' height='50' width='50' />
        </Link>
        <Typography
          style={{ textAlign: "Center" }}
          variant='h4'
          component='h1'
          className={classes.title}
        >
          <Link to='/' className={classes.titleLink}>
            Sunshine Apartments
          </Link>
        </Typography>
        {buttons}
      </Toolbar>
      <Notification notify={notify} setNotify={setNotify} authUser={authUser} />
    </AppBar>
  );
};

export default ButtonAppBar;
