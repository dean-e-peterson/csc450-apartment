import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ApplicationView from "../layout/ApplicationView";

const useStyles = makeStyles(theme => ({
  heading: {
    margin: theme.spacing(2),
  },
  statusFilterLabel: {
    marginLeft: theme.spacing(2),
  },
  statusFilter: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

// Note: This Applications.js page is for staff to review
// applications to live at the apartments.  For the user page
// where a user applies in the first place, see Apply.js.
export default function Applications({ authUser }) {
  const classes = useStyles();

  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Submitted"); // by default.

  useEffect(() => {
    const getApplications = async () => {
      try {
        if (authUser) {
          // Allow filtering by application status.
          const queryString = statusFilter === "All" ? "" : "?status=" + statusFilter;
          const response = await axios.get(
            "/api/applications" + queryString,
            { headers: { "x-auth-token" : authUser.token }}
          )
          setApplications(response.data);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    getApplications();
  }, [authUser, statusFilter]);

  const onStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  }

  return (
    <Typography component="div">
      <Typography variant="h5" component="h2" className={classes.heading}>
        Applications
      </Typography>

      <InputLabel id="statusLabel" className={classes.statusFilterLabel}>
        Status:
      </InputLabel>
      <Select
        className={classes.statusFilter}
        id="status"
        labelId="statusLabel"
        onChange={onStatusFilterChange}
        value={statusFilter}        
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="New">New</MenuItem>
        <MenuItem value="Submitted">Submitted</MenuItem>
        <MenuItem value="Accepted">Accepted</MenuItem>
        <MenuItem value="Rejected">Rejected</MenuItem>        
      </Select>

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