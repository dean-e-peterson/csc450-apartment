import React, { Fragment } from "react";
import {
  Grid,
} from "@material-ui/core";

export default function Comment({ comment }) {
  return (
    <Fragment>
      <Grid item xs={6}>
        <p><strong>{comment.name}</strong></p>
      </Grid> 
      <Grid item xs={6}>
        <p>{(new Date(comment.date)).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>
      </Grid>
      <Grid item xs={12}>
        <p>{comment.text}</p>
      </Grid>
    </Fragment>  
  );
};