import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Grid,
  TextareaAutosize,
  Typography,
  IconButton
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { makeStyles } from "@material-ui/core/styles";
import { setAppEditing } from "../utils/EditingHandler";
// import Calendar from "../../models/Calendar";

const useStyles = makeStyles(theme => ({
  textarea: {
    border: "solid 1px rgba(0, 0, 0, .23)", // Make look like other inputs.
    borderRadius: "4px",
    padding: "4px",
    width: "100%"
  }
}));

export default function Event({ event, setEvents, isNew, authUser }) {
  if (isNew) {
    // Define template new event that fills form fields with default values.
    event = { _id: "new", text: "" };
  }
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  //const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(isNew);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onEdit = () => {
    setIsEditing(true);
    setAppEditing(true);
  };

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
      // Remove placeholder event.
      setEvents(prevEvents =>
        prevEvents.filter(prevEvent => prevEvent._id !== "new")
      );
    }

    setIsEditing(false);
    setAppEditing(false);
  };

  if (isEditing) {
    // What to show if creating a new eventt.
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
    return (
      <Card>
        <CardContent>
          <CardHeader
            action={
              <IconButton onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            }
            title='Event 1'
            subheader=''
          />
          <Grid container>
            <Grid item xs={6}>
              <strong>{event.title}</strong>
            </Grid>
            {event.description.split("\n").map(content => (
              <p>{content}</p>
            ))}{" "}
          </Grid>
          <div>{event.time}</div>
          <div>{event.address}</div>
          <div>{event.eventDate}</div>
        </CardContent>
      </Card>
    );
  }
}
