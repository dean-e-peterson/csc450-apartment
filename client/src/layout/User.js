import React, { useState, useEffect } from "react";
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

export default function User({ user, setUsers, authUser }) {
  const classes = useStyles();

  const [isEditing, setIsEditing] = useState(false);
  const [units, setUnits] = useState([]); // For filling units dropdown.
  const [locations, setLocations] = useState([]); // For filling location dropdown.
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
    setEdit(false);
  }

  const onLocationChange = (e) => {
    setLocation(e.target.value);
    setUnit("");
  }

  const onUnitChange = (e) => {
    setUnit(e.target.value);
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
      const response = await axios.patch(
        "api/users/" + user._id,
        body,
        { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}
      );

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

  useEffect(() => {
    const getLocations = async () => {
      try {
        const response = await axios.get("/api/locations");
        setLocations(response.data);
      } catch (err) {
        console.error(err.message);
      }
    }
    getLocations();
  }, []);

  useEffect(() => {
    // We get units for the unit dropdown when we edit.
    const getUnits = async () => {
      try {
        if (authUser) { // Wait for user authentication.
          const response = await axios.get(
            "/api/units",
            { headers: { "x-auth-token": authUser.token }}
          );
          setUnits(response.data);
        }
      } catch (err) {
        console.error(err.message);
      }
    }
    getUnits();
  }, [authUser]); // [authUser] means only re-run when authUser changes.

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
                  placeholder="Email"
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
          <Grid container spacing={2} className={classes.userFlexContainer}>
            <Grid item xs={12} sm={4} lg={3}>
              {user.firstName + " " + (user.lastName ? user.lastName : "") }
            </Grid>
            <Grid item xs={12} sm={4} lg={2}>
              {user.email }
            </Grid>
            <Grid item xs={12} sm={3} lg={2}>
              {user.phone }
            </Grid>                     
            <Grid item xs={12} sm={1} lg={1}>
              {user.isStaff ? "staff" : "" }
            </Grid>
            <Grid item xs={12} sm={4} lg={2}>
              {user.unit ? user.unit.location.name : "" }
            </Grid>            
            <Grid item xs={12} sm={4} lg={1}>
              {user.unit ? "unit " + user.unit.number : ""}
            </Grid>
            <Grid item xs={12} sm={4} lg={1}>
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