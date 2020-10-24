import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles(theme => ({
  dropdown: {
    width: "100%",
  },
}));

export default function User({ user, setUsers, authUser }) {
  const classes = useStyles();

  const [isEditing, setIsEditing] = useState(false);
  const [units, setUnits] = useState([]);

  const onEdit = () => {
    setIsEditing(true);
  }

  const onSubmit = (e) => {
    e.preventDefault();
  }

  useEffect(() => {
    // We get units for the unit dropdown when we edit.
    const getUnits = async () => {
      try {
        if (authUser) { // Wait for user authentication.
          const response = await axios.get(
            "/api/units",
            { headers: { "x-auth-token": authUser.token }}
          )
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
            <Grid container>
              <Grid item xs={2}>
                <TextField
                  autoFocus
                  defaultValue={user.firstName}
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  placeholder="First Name"
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  defaultValue={user.lastName}
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  placeholder="Last Name"
                />
              </Grid>              
              <Grid item xs={4}>
                <TextField
                  defaultValue={user.email}
                  id="email"
                  label="Email"
                  name="email"
                  placeholder="Email"
                />
              </Grid>          
              <Grid item xs={1}>
                <FormControlLabel
                  label="Staff?"
                  control={
                    <Checkbox
                      defaultChecked={user.isStaff}
                    />
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <Select className={classes.dropdown}>
                  {
                    units.map(unit => 
                      <MenuItem>{unit.number}</MenuItem>
                    )
                  }
                </Select>
              </Grid>
              <Grid item xs={1}>
                <Button type="submit">
                  <SaveIcon />
                </Button>
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
          <Grid container>
            <Grid item xs={4}>
              {user.firstName + " " + (user.lastName ? user.lastName : "") }
            </Grid>
            <Grid item xs={4}>
              {user.email }
            </Grid>          
            <Grid item xs={1}>
              {user.isStaff ? "staff" : "" }
            </Grid>
            <Grid item xs={2}>
              {user.unit ? "unit " + user.unit.number : ""}
            </Grid>
            <Grid item xs={1}>
              <Button onClick={onEdit}>
                <EditIcon />
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }  
};