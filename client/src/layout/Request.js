import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Grid,
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { setAppEditing } from "../utils/EditingHandler";
import Comment from "./Comment";

export default function Request({ request, setRequests, units, users, authUser }) {
  const [scrollRef, setScrollRef] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const onExpandedClick = () => {
    setExpanded(!expanded);
  };

  const onNewReply = () => {
    setRequests(prevRequests => {
      // Warn if leave the page when editing page.
      setAppEditing(true);
      // Get this Request from array of all Requests.
      const thisRequest = prevRequests.find(prevRequest => prevRequest._id === request._id);
      // Append a placeholder comment to the end.
      thisRequest.comments.push({ _id: "new" });
      // Return a new array object, not just the changed array, to force render.
      return [ ...prevRequests ];
    });
    setExpanded(true);
  }

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
            <strong>{"Status: " + request.status}</strong>
          </Grid>
          <Grid item xs={12}>
            <strong>{request.summary}</strong>
          </Grid>
          <Grid item xs={12}>
            {request.details}
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button onClick={onNewReply}>
          New Reply
        </Button>
        { request.comments.length > 0 &&
          (expanded ?
            <Button onClick={onExpandedClick} aria-expanded={true}>
              Hide Replies
              <ExpandLessIcon />
            </Button>
          :
            <Button onClick={onExpandedClick} aria-expanded={false}>
              Show Replies
              <ExpandMoreIcon />
            </Button>
          )
        }  
      </CardActions>
      <Collapse in={expanded} mountOnEnter unmountOnExit>
        <CardContent>
          {
            request.comments.map(comment =>
              comment._id === "new" ?
                <Comment
                  key={comment._id}
                  isNew={true}
                  apiRoute="requests"
                  parent={request}
                  setParents={setRequests}
                  authUser={authUser}
                  setScrollRef={setScrollRef}
                />
              :
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
        </CardContent>
      </Collapse>
    </Card>
  );
};