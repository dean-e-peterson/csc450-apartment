import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
} from "@material-ui/core";
import Alert from "../layout/Alert";

export default function Alerts({ authUser }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const getAlerts = async () => {
      try {
        if (authUser) {
          const response = await axios.get(
            "/api/alerts/?user=" + authUser._id,
            { headers: { "x-auth-token" : authUser.token }}
          );
          setAlerts(response.data);
        } else {
          // Important for handling a logout with an alert displaying.
          setAlerts([]);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    getAlerts();
  }, [authUser]);

  return (
    <Typography component="div">
      {
        alerts.map(alert =>
          <Alert
            key={alert._id}
            alert={alert}
            setAlerts={setAlerts}
            authUser={authUser}
          />
        )
      }
    </Typography>
  )
};