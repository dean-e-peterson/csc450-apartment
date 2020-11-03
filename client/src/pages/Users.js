import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { setAppEditing } from "../utils/EditingHandler";
import User from "../layout/User";

const emptyUser = {
  _id: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  isStaff: false,
  unit: null,
}

const useStyles = makeStyles(theme => ({
  heading: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  newUserButton: {
    margin: theme.spacing(2),
  },
  tenantsOnly: {
    margin: theme.spacing(2),
  },
}));

export default function Users({ authUser }) {
  const classes = useStyles();

  const [users, setUsers] = useState([]);
  const [tenantsOnly, setTenantsOnly] = useState(false);

  const onNewUser = () => {
    setUsers(prevUsers => {
      // Add placeholder new post.  We use Date.now() so time in milliseconds
      // acts as a pseudo-unique temporary key.
      prevUsers.unshift({ ...emptyUser, _id: "new" + Date.now() });
      // Return a new array object, not just the changed array, to force render.
      return [ ...prevUsers ];
    });
    // Prevent leaving page with warning that user may have unsaved changes.
    setAppEditing(true);      
  };

  const onTenantsOnlyChange = () => {
    setTenantsOnly(prevTenantsOnly => !prevTenantsOnly);
  };

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
      <Button onClick={onNewUser} variant="outlined" className={classes.newUserButton}>
        New User/Tenant
      </Button>      
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