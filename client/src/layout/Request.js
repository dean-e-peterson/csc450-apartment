import React from "react";
import {
  Card,
  CardContent,
  Grid,
} from "@material-ui/core";

export default function Request({ request, units, authUser }) {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            {
              units.find(unit => unit._id === request.unit).location.name + " unit " +
              units.find(unit => unit._id === request.unit).number
            }
          </Grid>
          <Grid item xs={12} md={2}>
            {"Category: " + request.type}
          </Grid>
          <Grid item xs={12} md={4}>
            {(new Date(request.date)).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}
          </Grid>
          <Grid item xs={12} md={2}>
            {"Status: " + request.status}
          </Grid>
          <Grid item xs={12}>
            <strong>{request.summary}</strong>
          </Grid>
          <Grid item xs={12}>
            {request.details}
          </Grid>
          <Grid item xs={12}>
            {request.comments}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};