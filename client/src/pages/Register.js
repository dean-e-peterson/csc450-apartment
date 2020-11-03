import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { checkAuthToken } from "../utils/auth";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch"
    },

    minWidth: 275
  },
  button: {
    marginTop: theme.spacing(1),
  },
}));

export default function Register({ setAuthUser }) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = {
        firstName: e.target.firstName.value,
        lastName: e.target.lastName.value,        
        email: e.target.email.value,
        password: e.target.password.value,
      };
      const response = await Axios.post(
        "/api/auth/register",
        body,
        { headers: { "Content-type": "application/json" }}
      );

      // Check the returned token, which implicitly gets logged on user object.
      const user = await checkAuthToken(response.data.token);
      if (user) {
        localStorage.setItem("token", response.data.token);
        setAuthUser(user);

        // Back to homepage, unless we were on our way elsewhere, like apply page.
        if (location.state && location.state.referrer) {
          history.push(location.state.referrer);
        } else {
          history.push("/");
        }
      } else {
        localStorage.removeItem("token");
        setAuthUser(null);        
      }
    } catch (err) {
      localStorage.removeItem("token");
      setAuthUser(null);
    }
  }

  return (
    <Card className={classes.root} variant='outlined'>
      <CardContent>
        <Typography variant='h5' component='h2'>
          Register
        </Typography>
        <form onSubmit={onSubmit}>
          <TextField 
            id='firstName'
            label='First Name'
            margin='dense'
            name='firstName'
            required
            variant='outlined'
          />
          <TextField 
            id='lastName'
            label='Last Name'
            margin='dense'
            name='lastName'
            variant='outlined'
          />
          <TextField 
            id='email'
            label='Email'
            margin='dense'
            name='email'
            required
            type='email'
            variant='outlined'
          />
          <TextField
            id='password'
            label='Password'
            margin='dense'
            inputProps={{minLength: 8}}
            name='password'
            required
            type='password'
            variant='outlined'
          />
          <Button
            className={classes.button}
            color='primary'
            variant='outlined'
            type='submit'
          >
            Register
          </Button>
        </form>
        <Typography>
          Already have an account with us?
          <Link to="/login">Log in</Link>
        </Typography>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
}
