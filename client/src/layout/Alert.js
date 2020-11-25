import React from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  CardActions,
  CardContent,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  alertStyle: {
    backgroundColor: theme.palette.warning.light,
  }
}));

export default function Alert({ alert, setAlerts, authUser }) {
  const classes = useStyles();
  const history = useHistory();

  const onMoreInfoClick = () => {
    history.push(alert.link);
  };

  const onDismissClick = async () => {
    // Delete from database.
    await axios.delete(
      "/api/alerts/" + alert._id,
      { headers: { "x-auth-token" : authUser.token }}
    );

    // Delete from UI state.
    setAlerts(prevAlerts => prevAlerts.filter(prevAlert => (
      prevAlert._id !== alert._id
    )));
  }

  return (
    <Card className={classes.alertStyle}>
      <CardContent>
        {alert.text}
      </CardContent>
      <CardActions>
        <Button onClick={onMoreInfoClick}>
          More Information
        </Button>
        <Button onClick={onDismissClick}>
          Dismiss Alert
        </Button>
      </CardActions>
    </Card>
  )
};
