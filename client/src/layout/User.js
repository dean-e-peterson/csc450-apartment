import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import validator from "validator";
import { setAppEditing } from "../utils/EditingHandler";

const useStyles = makeStyles(theme => ({
  dropdown: {
    width: "100%",
  },
  dropdownLabel: {
    transform: "translate(0, 1.5px) scale(0.75)",
    transformOrigin: "top left",
  },
  userFlexContainer: {
    alignItems: "center",
  },
}));

export default function User({ user, setUsers, units, locations, authUser }) {
  const classes = useStyles();

  // Only new users should be in editing mode by default.
  const [isEditing, setIsEditing] = useState(user._id.substr(0, 3) === "new");
  // For filtering units dropdown.
  const [location, setLocation] = useState(user.unit ? user.unit.location._id: "");
  // For clearing unit value when changing location dropdown.
  const [unit, setUnit] = useState(user.unit ? user.unit._id : "");
  
  const setEdit = (edit) => {
    setIsEditing(edit); // State on this page.
    setAppEditing(edit); // Global reference counter to prompt on page navigation.
  }

  const onEdit = () => {
    setEdit(true);
  }

  const onCancel = () => {
    // If it's a new record, get rid of it entirely on cancel.
    if (user._id.substr(0, 3) === "new") {
      setUsers(prevUsers => prevUsers.filter(prevUser =>
        prevUser._id.substr(0, 3) !== "new"
      ));
    }
    setEdit(false);
  }

  const onLocationChange = (e) => {
    setLocation(e.target.value);
    setUnit("");
  }

  const onUnitChange = (e) => {
    setUnit(e.target.value);
  }

  const onEmailChange = (e) => {
    if (validator.isEmail(e.target.value)) {
      e.target.setCustomValidity("");
    } else {
      e.target.setCustomValidity("Please enter an email address");
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update database.
      const body = {
        firstName: e.target.firstName.value,
        lastName: e.target.lastName.value,
        email: e.target.email.value,
        phone: e.target.phone.value,        
        isStaff: e.target.isStaff.checked,
        unit: unit ? unit : null,
      };
      // Only set/reset password if one was entered.
      if (e.target.password.value !== "") {
        body.password = e.target.password.value;
      }

      let response;
      if (user._id.substr(0, 3) === "new") {
        response = await axios.post(
          "api/users/",
          body,
          { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}          
        );
      } else {
        response = await axios.patch(
          "api/users/" + user._id,
          body,
          { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}
        );        
      }

      // Get full record of selected unit, if any.
      const fullUnit = units.find(candidateUnit => unit === candidateUnit._id);

      // Update UI state.
      setUsers(prevUsers => prevUsers.map(prevUser => {
        if (prevUser._id === user._id) {
          const updatedUser = response.data;
          // Include unit number like GET /api/users even though that's not in user in db.
          if (unit) {
            updatedUser.unit = fullUnit;
          } else {
            updatedUser.unit = null;
          }
          return updatedUser;
        } else {
          return prevUser;
        }
      }));
      
      setEdit(false);      
    } catch (err) {
      console.error(err.message);
    }
  }

  if (isEditing) {
    // What to show if editing a user/tenant.
    return (
      <Card>
        <form onSubmit={onSubmit}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item>
                <TextField
                  autoFocus
                  defaultValue={user.firstName}
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  placeholder="First Name"
                  required
                />
              </Grid>
              <Grid item>
                <TextField
                  defaultValue={user.lastName}
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  placeholder="Last Name"
                />
              </Grid>              
              <Grid item>
                <TextField
                  defaultValue={user.email}
                  id="email"
                  label="Email"
                  name="email"
                  onChange={onEmailChange}                  
                  placeholder="Email"
                  required
                  type="email"
                />
              </Grid>
              <Grid item>
                <TextField
                  defaultValue={user.phone}
                  id="phone"
                  label="Phone"
                  name="phone"
                  placeholder="Phone"
                />
              </Grid>                      
              <Grid item>
                <InputLabel className={classes.dropdownLabel} id="locationLabel">
                  Location
                </InputLabel>
                <Select
                  className={classes.dropdown}
                  defaultValue={user.unit ? user.unit.location._id: ""}
                  id="location"
                  labelId="locationLabel"
                  name="location"
                  onChange={onLocationChange}
                >
                  <MenuItem value="">&nbsp;</MenuItem>
                  {
                    locations.map(location =>
                      <MenuItem key={location._id} value={location._id}>{location.name}</MenuItem>
                    )
                  }
                </Select>
              </Grid>
              <Grid item>
                <InputLabel className={classes.dropdownLabel} id="unitLabel">
                  Unit
                </InputLabel>
                <Select
                  className={classes.dropdown}
                  defaultValue={unit}
                  id="unit"
                  labelId="unitLabel"
                  name="unit"
                  onChange={onUnitChange}
                >
                  <MenuItem value="">&nbsp;</MenuItem>
                  {
                    units.filter(unit => unit.location._id === location).map(unit => 
                      <MenuItem key={unit._id} value={unit._id}>{unit.number}</MenuItem>
                    )
                  }
                </Select>
              </Grid>
              <Grid item>
                <FormControlLabel
                  label="Staff?"
                  control={
                    <Checkbox
                      defaultChecked={user.isStaff}
                      id="isStaff"
                      name="isStaff"
                    />
                  }
                />
              </Grid>
              <Grid item>
                <TextField
                  defaultValue=""
                  id="password"
                  inputProps={{minLength: 8}}                  
                  label="Set/Reset Password"
                  name="password"
                  placeholder="Set/Reset Password"
                />
              </Grid>
              <Grid item>
                <IconButton type="submit" aria-label="Save" title="Save">
                  <SaveIcon />
                </IconButton>
                <IconButton aria-label="Cancel" title="Cancel" onClick={onCancel}>
                  <CancelIcon />
                </IconButton>                
              </Grid>
            </Grid>            
          </CardContent>
        </form>
      </Card>  
    );
  } else {
    // What to show if viewing a user/tenant.
    return (
      <Card>
        <CardContent>
          <Grid container spacing={1} className={classes.userFlexContainer}>
            <Grid item xs={12} md={3}>
              {user.firstName + " " + (user.lastName ? user.lastName : "") }
            </Grid>
            <Grid item xs={12} md={2}>
              {user.email }
            </Grid>
            <Grid item xs={12} md={2}>
              {user.phone }
            </Grid>                     
            <Grid item xs={12} md={2}>
              {user.unit ? user.unit.location.name : "" }
            </Grid>            
            <Grid item xs={12} md={1}>
              {user.unit ? "unit " + user.unit.number : ""}
            </Grid>
            <Grid item xs={12} md={1}>
              {user.isStaff ? "staff" : "" }
            </Grid>
            <Grid item xs={12} md={1}>
              <IconButton onClick={onEdit} aria-label="Edit" title="Edit">
                <EditIcon />
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }  
};