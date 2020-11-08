import React, { useState, Fragment, useEffect } from "react";
import axios from "axios";
import {
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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
}));

export default function Maintenance({ authUser }) {
  const classes = useStyles();

  const [requests, setRequests] = useState([]);
  const [units, setUnits] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All"); // by default.
    
  const onStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  }

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
              authUser={authUser}
            />
          )
        }
      </Typography>
    </Fragment>
  );
};
