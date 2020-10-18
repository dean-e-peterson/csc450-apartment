import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import ReactDOM from "react-dom";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch"
    },

    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
}));

export default function Login() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.root} variant='outlined'>
      <CardContent>
        <TextField id='outlined-basic' label='Email' variant='outlined' />
        <TextField
          style={{ marginTop: "5px" }}
          id='outlined-basic'
          label='Password'
          variant='outlined'
        />
        <Button
          style={{ textAlign: "right", marginTop: "5px" }}
          variant='outlined'
          color='primary'
          href='#outlined-buttons'
        >
          Login
        </Button>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
}
