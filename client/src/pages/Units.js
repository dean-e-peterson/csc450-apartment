import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { setAppEditing } from "../utils/EditingHandler";
import Unit from "../layout/Unit";

const emptyUnit = {
  _id: "",
  location: null,
  number: "",
  bedrooms: null,
  bathrooms: null,
  description: "",
}

const useStyles = makeStyles(theme => ({
  heading: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  newUnitButton: {
    margin: theme.spacing(2),
  },
}));

export default function Units({ authUser }) {
  const classes = useStyles();

  const [units, setUnits] = useState([]);
  
  const onNewUnit = () => {
    setUnits(prevUnits => {
      // Add placeholder new unit.  We use Date.now() so time in milliseconds
      // acts as a pseudo-unique temporary key.
      prevUnits.unshift({ ...emptyUnit, _id: "new" + Date.now() });
      // Return a new array object, not just the changed array, to force render.
      return [ ...prevUnits ];
    });
    // Prevent leaving page with warning that user may have unsaved changes.
    setAppEditing(true);      
  };

  useEffect(() => {
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
  }, [authUser]); // Only re-run when these change.

  return (
    <Typography component="div">
      <Typography variant="h5" component="h2" className={classes.heading}>
        Units
      </Typography>
      <Button onClick={onNewUnit} variant="outlined" className={classes.newUnitButton}>
        New Unit
      </Button>
      {
        units.map(unit =>
          <Unit 
            key={unit._id}
            unit={unit}
            setUnits={setUnits}
            authUser={authUser}
          />
        )
      }
    </Typography>
  );
};