import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Grid,
  TextareaAutosize,
  Typography
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { makeStyles } from "@material-ui/core/styles";
import { setAppEditing } from "../utils/EditingHandler";

const useStyles = makeStyles(theme => ({
  textarea: {
    border: "solid 1px rgba(0, 0, 0, .23)", // Make look like other inputs.
    borderRadius: "4px",
    padding: "4px",
    width: "100%"
  }
}));

export default function Event({
  event,
  setEvents,
  isNew,
  authUser,
  setAuthUser
}) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  //const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(isNew);

  //const isNew = true;
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onEdit = () => {
    setIsEditing(true);
    setAppEditing(true);
  };

  if (isNew) {
    // Define template new post that fills form fields with default values.
    event = { _id: "new", text: "" };
  }

  const onDelete = async () => {
    // Delete event from server.
    await axios.delete("/api/calendar/" + event._id, {
      headers: { "x-auth-token": authUser.token }
    });

    // Remove event from UI state.
    setEvents(prevEvents =>
      prevEvents.filter(prevEvent => !(prevEvent._id === event._id))
    );
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const body = {
        text: e.target.text.value
      };

      // Save new or edited event to server.
      let response;
      if (isNew) {
        response = await axios.post("/api/calendar", body, {
          headers: {
            "x-auth-token": authUser.token,
            "Content-type": "application/json"
          }
        });
      } else {
        response = await axios.patch("/api/calendar/", body, {
          headers: {
            "x-auth-token": authUser.token,
            "Content-type": "application/json"
          }
        });
      }

      // Replace placeholder new post with actual one returned by server with real id.
      setEvents(prevEvents =>
        prevEvents.map(prevEvent =>
          prevEvent._id === event._id ? response.data : prevEvent
        )
      );

      if (!isNew) {
        // Return to viewing mode (new event gets different id on save, so not needed).
        setIsEditing(false);
      }
      setAppEditing(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  const onCancel = () => {
    if (isNew) {
      // Remove placeholder post.
      setEvents(prevEvents =>
        prevEvents.filter(prevEvent => prevEvent._id !== "new")
      );
    }

    setIsEditing(false);
    setAppEditing(false);
  };

  if (isEditing) {
    // What to show if editing a new or existing post.
    return (
      <Card>
        <form onSubmit={onSubmit}>
          <CardContent>
            <Typography component='div'>
              <p>
                <strong>{event.name}</strong>
              </p>
              <TextareaAutosize
                autoFocus
                className={classes.textarea}
                defaultValue={event.text}
                id='text'
                label='Event text'
                name='text'
                placeholder='Type Event here'
              />
            </Typography>
          </CardContent>
          <CardActions>
            <Button type='submit'>Save Event</Button>
            <Button onClick={onCancel}>Cancel</Button>
          </CardActions>
        </form>
      </Card>
    );
  } else {
    return <div>hi</div>;
  }
}
