import React from "react";
import {
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Application from "../layout/Application";

const useStyles = makeStyles(theme => ({
  heading: {
    margin: theme.spacing(2),
  },
  p: {
    marginLeft: theme.spacing(2),
  },
}));

export default function Apply({ authUser }) {
  const classes = useStyles();

  return (
    <Typography component="div">
      <Typography variant="h5" component="h2" className={classes.heading}>
        Apply
      </Typography>
      <p className={classes.p}>
        Hello {authUser && authUser.firstName}!
        We are delighted that you are applying to live at Sunshine Apartments.
        Please provide the following information...
      </p>
      <Application authUser={authUser} />
    </Typography>
  );
};