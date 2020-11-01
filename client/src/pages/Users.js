import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Checkbox,
  FormControlLabel,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import User from "../layout/User";

const useStyles = makeStyles(theme => ({
  heading: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  tenantsOnly: {
    margin: theme.spacing(2),
  }
}));

export default function Users({ authUser }) {
  const classes = useStyles();

  const [users, setUsers] = useState([]);
  const [tenantsOnly, setTenantsOnly] = useState(false);

  const onTenantsOnlyChange = () => {
    setTenantsOnly(prevTenantsOnly => !prevTenantsOnly);
  }

  useEffect(() => {
    const getUsers = async () => {
      try {
        if (authUser) { // Wait for user authentication.
          const response = await axios.get(
            "/api/users?tenantsOnly=" + (tenantsOnly ? "1": "0"),
            { headers: { "x-auth-token": authUser.token }}
          );
          setUsers(response.data);
        }
      } catch (err) {
        console.error(err.message);
      }
    }
    getUsers();
  }, [authUser, tenantsOnly]); // Only re-run when these change.

  return (
    <Typography component="div">
      <Typography variant="h5" component="h2" className={classes.heading}>
        Users
      </Typography>
      <FormControlLabel
        className={classes.tenantsOnly}
        label="Tenants only"
        control={
          <Checkbox checked={tenantsOnly} onChange={onTenantsOnlyChange} />
        }
      />
      {
        users.map(user =>
          <User 
            key={user._id}
            user={user}
            setUsers={setUsers}
            authUser={authUser}
          />
        )
      }
    </Typography>
  );
};