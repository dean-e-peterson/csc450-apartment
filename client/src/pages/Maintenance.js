import React, { useState, Fragment, useEffect } from "react";
import axios from "axios";
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { setAppEditing } from "../utils/EditingHandler";
import Request from "../layout/Request";

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
  newRequestButton: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}));

export default function Maintenance({ authUser }) {
  const classes = useStyles();

  const [requests, setRequests] = useState([]);
  const [units, setUnits] = useState([]);
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All"); // by default.
    
  const onStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  }

  const emptyRequest = {
    unit: authUser.unit,
    user: authUser._id,
    type: "Other",
    summary: "",
    details: "",
    comments: [],
    status: "New",
  }
  
  const onNewRequest = () => {
    setRequests(prevRequests => {
      // Add placeholder new post.  We use Date.now() so time in milliseconds
      // acts as a pseudo-unique temporary key.
      prevRequests.unshift({
        ...emptyRequest,
        _id: "new" + Date.now(),
        date: new Date()
      });
      // Return a new array object, not just the changed array, to force render.
      return [ ...prevRequests ];
    });
    // Prevent leaving page with warning that user may have unsaved changes.
    setAppEditing(true);
  };

  useEffect(() => {
    // Get units for displaying location and unit name.
    const getUnits = async () => {
      try {
        if (authUser) {
          const response = await axios.get(
            "/api/units",
            { headers: { "x-auth-token" : authUser.token }}            
          );
          setUnits(response.data);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    getUnits();

    // Get users for displaying user name.
    const getUsers = async () => {
      try {
        if (authUser) {
          // Only get the users you have a right to see
          // (everyone if staff, you and your roommates if not).
          let queryString = "";
          if (!authUser.isStaff) {
            queryString = "?unit=" + authUser.unit;
          }
          
          // Get list of users from database.
          const response = await axios.get(
            "/api/users" + queryString,
            { headers: { "x-auth-token" : authUser.token }}            
          )
          setUsers(response.data);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    getUsers();
  }, [authUser]);

  useEffect(() => {
    const getRequests = async () => {
      try {
        if (authUser) {
          let queryString;
          if (authUser.isStaff) {
            if (statusFilter === "All") {
              // Staff wanting all maintenance requests.
              queryString = "";
            } else {
              // Staff wanting maintenance requests filtered by status.
              queryString = "?status=" + statusFilter;
            }
          } else {
            // Non-staff can only get maintenance requests for their own unit.
            queryString = "?unit=" + authUser.unit;
          }

          const response = await axios.get(
            "/api/requests" + queryString,
            { headers: { "x-auth-token" : authUser.token }}
          );

          setRequests(response.data);
        }
      } catch (err) {
        console.error(err.message);
      }
    }
    getRequests();
  }, [authUser, statusFilter]);

  return (
    <Fragment>
      <Typography variant="h5" component="h2" className={classes.heading}>
        Maintenance
      </Typography>
      <Button onClick={onNewRequest} variant="outlined" className={classes.newRequestButton}>
        New Maintenance Request
      </Button>

      {authUser && authUser.isStaff &&
        <Fragment>
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
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </Fragment>
      }

      <Typography component="div">
        {
          requests.map(request =>
            <Request
              key={request._id}
              request={request}
              setRequests={setRequests}
              units={units}
              users={users}
              authUser={authUser}
            />
          )
        }
      </Typography>
    </Fragment>
  );
};
