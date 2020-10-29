import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ApplicationView from "../layout/ApplicationView";

const useStyles = makeStyles(theme => ({
  heading: {
    margin: theme.spacing(2),
  },
}));

// Note: This Applications.js page is for staff to review
// applications to live at the apartments.  For the user page
// where a user applies in the first place, see Apply.js.
export default function Applications({ authUser }) {
  const classes = useStyles();

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const getApplications = async () => {
      try {
        if (authUser) {
          const response = await axios.get(
            "/api/applications",
            { headers: { "x-auth-token" : authUser.token }}
          )
          setApplications(response.data);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    getApplications();
  }, [authUser]);

  return (
    <Typography component="div">
      <Typography variant="h5" component="h2" className={classes.heading}>
        Applications
      </Typography>
      {
        applications.map(application =>
          <ApplicationView
            key={application._id}
            application={application}
            setApplications={setApplications}
            authUser={authUser} />
        )
      }
    </Typography>
  );
};