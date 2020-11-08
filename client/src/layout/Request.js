import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
} from "@material-ui/core";
import Comment from "./Comment";

export default function Request({ request, setRequests, units, users, authUser }) {

  const [scrollRef, setScrollRef] = useState(null);

  useEffect(() => {
    // Scroll form into view if editing an existing or new reply.
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
  }, [scrollRef]);

  return (
    <Card>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12} md={3}>
            <strong>
              {
                users.find(user => user._id === request.user) &&
                users.find(user => user._id === request.user).firstName + " " +
                users.find(user => user._id === request.user).lastName
              }
            </strong>
          </Grid>
          <Grid item xs={12} md={3}>
            {
              units.find(unit => unit._id === request.unit) &&
              units.find(unit => unit._id === request.unit).location.name + " unit " +
              units.find(unit => unit._id === request.unit).number
            }
          </Grid>
          <Grid item xs={12} md={3}>
            {(new Date(request.date)).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}
          </Grid>
          <Grid item xs={12} md={2}>
            {"Category: " + request.type}
          </Grid>
          <Grid item xs={12} md={1}>
            {"Status: " + request.status}
          </Grid>
          <Grid item xs={12}>
            <strong>{request.summary}</strong>
          </Grid>
          <Grid item xs={12}>
            {request.details}
          </Grid>
          <Grid item xs={12}>
            {
              request.comments.map(comment =>
                <Comment
                  key={comment._id}
                  comment={comment}
                  isNew={false}
                  apiRoute="requests"
                  parent={request}
                  setParents={setRequests}
                  authUser={authUser}
                  setScrollRef={setScrollRef}
                />
              )
            }
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};