import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
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
  };
  const emptyUser = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  };
  const emptyReference = {
    name: "",
    email: "",
    phone: "",
  };

// Note: "Application" here refers to someone's application to live
// at Sunshine Apartments, not the apartment management computer
// application.  See App.js for that.
export default function Application({ authUser }) {
  const [isNew, setIsNew] = useState(false);
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
        if (err.message === "Request failed with status code 404") {
          // Must be a new application for this user.
          setIsNew(true);
        } else {
          console.error(err.message);
        }
      }
    }
    getApplication();
  }, [authUser]);

  const onAddReference = () => {
    // Date.now() just uses time in milliseconds
    // to generate a pseudo-unique temporary key.
    setApplication(application => {
      application.references.push({ ...emptyReference, _id: "new" + Date.now() });
      return { ...application };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // User is already in database by the time they get to this page,
      // So we never need the new user API, just the changed user API.
      // Note that end user doesn't have rights to change fields like
      // isStaff and unit, so, we make sure not to include those.
      const updatedUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      }
      await axios.patch(
        "/api/users/" + user._id,
        updatedUser,
        { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}
      );


      // Note that the server won't save new references if an _id is given, so
      // we remove the pseudo-id's added to new references in onAddReference.
      const updatedApplication = { ...application };
      updatedApplication.references = application.references.map(reference => {
        const updatedReference = { ...reference };
        if (updatedReference._id.substr(0, 3) === "new") {
          delete updatedReference._id;
        }
        return updatedReference;
      });

      // Application may be a new record in the database,
      // so call the new or changed API accordingly.
      let response;
      if (isNew) {
        response = await axios.post(
          "/api/applications",
          updatedApplication,
          { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}
        );
      } else {
        response = await axios.patch(
          "/api/applications/" + application._id,
          updatedApplication,
          { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}
        );
      }

      // Update application UI state, in particular any db-assigned IDs.
      setApplication(response.data);
    } catch (err) {
      console.error(err.message);
    }
  }

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
      <form onSubmit={onSubmit}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" component="h3">
                Contact Information
              </Typography>
            </Grid>            
            <Grid item xs={12}>
              <TextField
                id="firstName"
                label="First Name"
                name="firstName"
                onChange={onChangeUser}
                placeholder="First Name"
                value={user.firstName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="lastName"
                label="Last Name"
                name="lastName"
                onChange={onChangeUser}
                placeholder="LastName"
                value={user.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="email"
                label="Email"
                name="email"
                onChange={onChangeUser}
                placeholder="Email"
                value={user.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="phone"
                label="Phone"
                name="phone"
                onChange={onChangeUser}
                placeholder="Phone"
                value={user.phone}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" component="h3">
                References
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {
                application.references.map(reference =>
                  <Reference 
                    key={reference._id}
                    reference={reference}
                    setApplication={setApplication}
                  />
                )
              }
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" onClick={onAddReference}>
                Add Reference
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                To rent to you, we need to conduct a background check.
                Do we have your permission to conduct a background check.
              </Typography>
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
            </Grid>
            <Grid item xs={12}>
              <Typography>
                To rent to you, we need to conduct a credit check.
                Do we have your permission to conduct a credit check.
              </Typography>
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
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button type="submit" variant="outlined">
            Save Application
          </Button>
          <Button variant="outlined">
            Submit Application
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};
