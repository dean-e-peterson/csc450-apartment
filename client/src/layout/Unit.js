import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
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
  unitFlexContainer: {
    alignItems: "center",
  },
}));

export default function Unit({ unit, setUnits, authUser }) {
  const classes = useStyles();

  // Only new users should be in editing mode by default.
  const [isEditing, setIsEditing] = useState(unit._id.substr(0, 3) === "new");
  const [locations, setLocations] = useState([]); // For filling location dropdown.

  const setEdit = (edit) => {
    setIsEditing(edit); // State on this page.
    setAppEditing(edit); // Global reference counter to prompt on page navigation.
  }
    
  const onEdit = () => {
    setEdit(true);
  };

  const onCancel = () => {
    // If it's a new record, get rid of it entirely on cancel.
    if (unit._id.substr(0, 3) === "new") {
      setUnits(prevUnits => prevUnits.filter(prevUnit =>
        prevUnit._id.substr(0, 3) !== "new"
      ));
    }
    setEdit(false);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update database.
      const body = {
        location: e.target.location.value,
        number: e.target.number.value,
        bedrooms: Number(e.target.bedrooms.value),
        description: e.target.description.value,
      };
      if (e.target.bathrooms.value) {
        body.bathrooms = Number(e.target.bathrooms.value);
      }
      let response;
      if (unit._id.substr(0, 3) === "new") {
        response = await axios.post(
          "api/units/",
          body,
          { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}          
        );
      } else {
        response = await axios.patch(
          "api/units/" + unit._id,
          body,
          { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}
        );        
      }

      // Update UI state.
      setUnits(prevUnits => prevUnits.map(prevUnit => {
        if (prevUnit._id === unit._id) {
          const updatedUnit = response.data;
          updatedUnit.location = {
            _id: response.data.location,
            name: locations.find(location => location._id === response.data.location).name
          }
          return updatedUnit;
        } else {
          return prevUnit;
        }
      }));

      setEdit(false);
    } catch (err) {
      console.error(err.message);
    }
  }
  
  useEffect(() => {
    // We get locations for the location dropdown when we edit.
    const getLocations = async () => {
      try {
        if (authUser) { // Wait for user authentication.
          const response = await axios.get(
            "/api/locations",
            { headers: { "x-auth-token": authUser.token }}
          );
          setLocations(response.data);
        }
      } catch (err) {
        console.error(err.message);
      }
    }
    getLocations();
  }, [authUser]); // [authUser] means only re-run when authUser changes.

  if (isEditing) {
    // What to show if editing a unit.
    return (
      <Card>
        <form onSubmit={onSubmit}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item>
                <InputLabel className={classes.dropdownLabel} id="locationLabel">
                  Location
                </InputLabel>
                <Select
                  autoFocus                
                  className={classes.dropdown}
                  defaultValue={unit.location ? unit.location._id: ""}
                  id="location"
                  labelId="locationLabel"
                  name="location"
                  required
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
                <TextField
                  defaultValue={unit.number}
                  id="number"
                  label="Number"
                  name="number"
                  placeholder="Number"
                  required
                />
              </Grid>
              <Grid item>
                <TextField
                  defaultValue={unit.bedrooms}
                  id="bedrooms"
                  label="Bedrooms"
                  name="bedrooms"
                  placeholder="Bedrooms"
                  required
                  type="number"
                />
              </Grid>              
              <Grid item>
                <TextField
                  defaultValue={unit.bathrooms}
                  id="bathrooms"
                  label="Bathrooms"
                  name="bathrooms"
                  placeholder="Bathrooms"
                  type="number"
                />
              </Grid>
              <Grid item>
                <TextField
                  defaultValue={unit.description}
                  id="description"
                  label="Description"
                  name="description"
                  placeholder="Description"
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
    // What to show if viewing a unit.      
    return (
      <Card>
        <CardContent>
          <Grid container spacing={0} className={classes.unitFlexContainer}>
            <Grid item xs={12} sm={6}>
              {unit.location.name}
            </Grid>
            <Grid item xs={12} sm={1}>
              {unit.number}
            </Grid>
            <Grid item xs={12} sm={2}>
              {unit.bedrooms + " bedroom"}
            </Grid>                     
            <Grid item xs={12} sm={3}>
              {unit.bathrooms ? unit.bathrooms + " bathroom" : ""}
            </Grid>            
            <Grid item xs={12} sm={11}>
              {unit.description}
            </Grid>
            <Grid item xs={12} sm={1}>
              <IconButton onClick={onEdit} aria-label="Edit" title="Edit">
                <EditIcon />
              </IconButton>
            </Grid>          
          </Grid>
        </CardContent>
      </Card>
    );
  }
}