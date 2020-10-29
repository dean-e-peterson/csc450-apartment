import React from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core";

export default function ApplicationView({ application, setApplications, authUser }) {
  const setStatus = async (status) => {
    try {
      // Update database.
      await axios.patch(
        "/api/applications/" + application._id,
        { status: status },
        { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}
      )

      // Update UI state.
      setApplications(prevApplications => prevApplications.map(prevApplication => {
        if (prevApplication._id === application._id) {
          return { ...prevApplication, status: status };
        } else {
          return prevApplication;
        }
      }));
    } catch (err) {
      console.error(err.message);
    }
  }

  const onAccept = async () => {
    await setStatus("Accepted");
  }

  const onReject = async () => {
    await setStatus("Rejected");
  }  

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h3">
              Contact Information:
            </Typography>    
          </Grid>          
          <Grid item xs={3}>
            {application.user.firstName}
          </Grid>
          <Grid item xs={3}>
            {application.user.lastName}
          </Grid>
          <Grid item xs={3}>
            {application.user.email}
          </Grid>
          <Grid item xs={3}>
            {application.user.phone}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" component="h3">
              References:
            </Typography>
            {
              application.references.map(reference =>
                <Card key={reference._id}>
                  <CardContent>
                    <Grid container>
                      <Grid item xs={3}>
                        {reference.name}
                      </Grid>
                      <Grid item xs={3}>
                        {reference.email}
                      </Grid>
                      <Grid item xs={3}>
                        {reference.phone}
                      </Grid>
                      <Grid item xs={3}>
                        {reference.relation}
                      </Grid>                                                                  
                    </Grid>           
                  </CardContent>
                </Card>
              )
            }
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" component="h3">
              Status: {application.status}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button onClick={onAccept}>
          Accept Application
        </Button>
        <Button onClick={onReject}>
          Reject Application
        </Button>
      </CardActions>
    </Card>
  );
};