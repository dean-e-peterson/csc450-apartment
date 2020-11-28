import React, { useState, useEffect, Fragment } from "react";
import "./Calendar.css";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { Button, Typography, TextareaAutosize } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import { setAppEditing } from "../utils/EditingHandler";
import Event from "../layout/Event";
import Grid from "@material-ui/core/Grid";
import axios from "axios";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // root: {
    //   maxWidth:
    // },
    media: {
      height: 0,
      paddingTop: "56.25%" // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: "rotate(180deg)"
    },
    avatar: {
      backgroundColor: red[500]
    }
  })
);

export default function Calendar({ authUser, setAuthUser }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [events, setEvents] = useState([]);
  const isNew = true;
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onNewEvent = () => {
    setEvents(prevEvents => {
      // Add placeholder new post.
      prevEvents.unshift({ _id: "new" });
      // Return a new array object, not just the changed array, to force render.
      return [...prevEvents];
    });
    // Prevent leaving page with warning that user may have unsaved changes.
    setAppEditing(true);
  };

  const onCancel = () => {
    if (isNew) {
      // Remove placeholder event.
      setEvents(prevEvents =>
        prevEvents.filter(prevEvent => prevEvent._id !== "new")
      );
    }
  };
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getEvents = async () => {
      try {
        if (authUser) {
          // Wait for user authentication.
          const response = await axios.get("/api/calendar", {
            headers: { "x-auth-token": authUser.token }
          });
          setEvents(response.data);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    getEvents();
  }, [authUser]); // [authUser] means only re-run when authUser changes.
  return (
    <Fragment>
      <Grid container>
        <Grid item>
          {authUser && authUser.isStaff && (
            <Button // Logged in as staff.
              onClick={() => setIsEditing(true)}
              variant='outlined'
            >
              New Event
            </Button>
          )}
        </Grid>
        {isEditing && (
          <Grid item xs={12}>
            <TextareaAutosize
              autoFocus
              className={classes.textarea}
              id='text'
              label='Event text'
              name='text'
              placeholder='Create event'
            />
            <form>
              <CardActions>
                <Button type='submit'>Save Event</Button>
                <Button onClick={onCancel}>Cancel</Button>
              </CardActions>
            </form>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant='h5' component='h2' className={classes.heading}>
            Events Calendar
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Card className={classes.root} xs={12}>
            <CardContent>
              <Typography paragraph>
                {events.map(event =>
                  event._id === "new" ? (
                    <Event
                      isNew={true}
                      key={event._id}
                      apiRoute='calendar'
                      setEvents={setEvents}
                      authUser={authUser}
                    />
                  ) : (
                    <Event
                      key={event._id}
                      event={event}
                      setEvents={setEvents}
                      authUser={authUser}
                    />
                  )
                )}
              </Typography>
            </CardContent>
            {/* </Collapse> */}
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
}
