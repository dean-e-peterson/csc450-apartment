import React from "react";
import { Link, useHistory } from "react-router-dom";
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import validator from "validator";
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

export default function Login({ setAuthUser }) {
  const classes = useStyles();
  const history = useHistory();

  const onEmailChange = (e) => {
    if (validator.isEmail(e.target.value)) {
      e.target.setCustomValidity("");
    } else {
      e.target.setCustomValidity("Please enter an email address");
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        email: e.target.email.value,
        password: e.target.password.value,
      };
      const response = await Axios.post(
        "/api/auth",
        body,
        { headers: { "Content-type": "application/json" }}
      );

      // Check the returned token, which implicitly gets logged on user object.
      const user = await checkAuthToken(response.data.token);
      if (user) {
        localStorage.setItem("token", response.data.token);
        setAuthUser(user);

        // Back to homepage.
        history.push("/");
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
          Log In
        </Typography>
        <form onSubmit={onSubmit}>
          <TextField 
            id='email'
            label='Email'
            margin='dense'
            name='email'
            onChange={onEmailChange}       
            required
            type='email'
            variant='outlined'
          />
          <TextField
            id='password'
            label='Password'
            margin='dense'            
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
            Login
          </Button>
        </form>
        <Typography>
          Don't have an account with us yet?
          <Link to="/register">Register</Link>
        </Typography>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
}
