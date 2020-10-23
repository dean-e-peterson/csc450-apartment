import React, { useState, useEffect, Fragment } from "react";
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
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
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
    <Fragment>
      <Typography variant='h5' component='h2' className={classes.heading}>
        Users
      </Typography>
      <FormControlLabel label="Tenants only" control={
        <Checkbox checked={tenantsOnly} onChange={onTenantsOnlyChange} />
      } />
      {
        users.map(user =>
          <User key={user._id} user={user} setUsers={setUsers} authUser={authUser} />
        )
      }
    </Fragment>
  );
};