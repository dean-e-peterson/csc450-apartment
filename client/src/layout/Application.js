import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import Reference from "./Reference";

  // Even before we get application or user from the server,
  // we want the fields available to avoid having to do stuff
  // like user ? user.firstName : "" in the form controls.
  const emptyApplication = {
    user: null,
    references: [],
    backgroundPermission: false,
    creditPermission: false,
  }
  const emptyUser = {
    firstName: "",
    lastName: "",
    email: "",
  }

// Note: "Application" here refers to someone's application to live
// at Sunshine Apartments, not the whole apartment management computer
// application.  See App.js for that.
export default function Application({ authUser }) {
  const [application, setApplication] = useState(emptyApplication);
  const [user, setUser] = useState(emptyUser);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }

    const getApplication = async () => {
      try {
        if (authUser) {
          // Even if there is not an application in progress,
          // make the new application for the logged on user.
          setApplication({ ...emptyApplication, user: authUser._id });

          // See if there is already an application in progress for this user.
          const response = await axios.get(
            "/api/applications/user/" + authUser._id,
            { headers: { "x-auth-token" : authUser.token }}
          );

          setApplication(response.data);
        }
      } catch (err) {
        console.error(err.message);
      }
    }
    getApplication();
  }, [authUser]);

  const onChangeUser = (e) => {
    e.persist(); // No longer needed as of React v 17?
    setUser(prevUser => ({ ...prevUser, [e.target.name]: e.target.value }));
  };

  const onChangeApplicationCheckbox = (e) => {
    e.persist(); // No longer needed as of React v 17?
    setApplication(prevApplication => ({ ...prevApplication, [e.target.name]: e.target.checked }));
  };

  return (
    <Card>
      <CardContent>
        <form>
          <TextField
            id="firstName"
            label="First Name"
            name="firstName"
            onChange={onChangeUser}
            placeholder="First Name"
            value={user.firstName}
          />
          <TextField
            id="lastName"
            label="Last Name"
            name="lastName"
            onChange={onChangeUser}
            placeholder="LastName"
            value={user.lastName}
          />
          <TextField
            id="email"
            label="Email"
            name="email"
            onChange={onChangeUser}
            placeholder="Email"
            value={user.email}
          />
          <TextField
            id="phone"
            label="Phone"
            name="phone"
            onChange={onChangeUser}
            placeholder="Phone"
            value="Add to User model"
          />
          <Typography variant="h6" component="h3">
            References
          </Typography>
          {
            application.references.map(reference =>
              <Reference key={reference._id} reference={reference} />
            )
          }
          <FormControlLabel
            label="Background check permitted"
            control={
              <Checkbox
                checked={application.backgroundPermission}
                name="backgroundPermission"
                onChange={onChangeApplicationCheckbox}
              />
            }
          />
          <FormControlLabel
            label="Credit check permitted"
            control={
              <Checkbox
                checked={application.creditPermission}
                name="creditPermission"
                onChange={onChangeApplicationCheckbox}
              />
            }
          />
        </form>
      </CardContent>
    </Card>
  );
};
