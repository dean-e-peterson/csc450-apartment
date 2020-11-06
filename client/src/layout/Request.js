import React from "react";
import {
  Card,
  CardContent,
  Grid,
} from "@material-ui/core";

export default function Request({ request, setAuthUser }) {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item>
            {request.status}
          </Grid>          
          <Grid item>
            {request.unit}
          </Grid>
          <Grid item>
            {request.type}
          </Grid>
          <Grid item>
            {request.summary}
          </Grid>
          <Grid item>
            {request.details}
          </Grid>
          <Grid item>
            {request.comments}
          </Grid>
          <Grid item>
            {request.date}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};