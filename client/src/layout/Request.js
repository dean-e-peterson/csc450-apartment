import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { makeStyles } from "@material-ui/core/styles";
import { setAppEditing } from "../utils/EditingHandler";
import Comment from "./Comment";

const useStyles = makeStyles(theme => ({
  textarea: {
    border: "solid 1px rgba(0, 0, 0, .23)", // Make look like other inputs.
    borderRadius: "4px",
    padding: "4px",
    width: "100%",
  },  
}));

export default function Request({ request, setRequests, units, users, authUser }) {
  const classes = useStyles();

  const [isEditing, setIsEditing] = useState(request._id.substr(0, 3) === "new");
  const [scrollRef, setScrollRef] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const onExpandedClick = () => {
    setExpanded(!expanded);
  };

  const onCancel = () => {
    if (request._id.substr(0, 3) === "new") {
      // Remove placeholder post.
      setRequests(prevRequests => prevRequests.filter(prevRequest =>
        prevRequest._id !== request._id
      ));
    }

    setIsEditing(false);
    setAppEditing(false);
  }

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

  if (isEditing) {
    return (
      <Card>
        <form>
          <CardContent>
            <Grid container spacing={2}>
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
              <Grid item xs={12} md={3}>
                <strong>{"Status: " + request.status}</strong>
              </Grid>                      
              <Grid item xs={12}>
                <InputLabel id="typeLabel">
                  Status:
                </InputLabel>
                <Select
                  defaultValue={request.type}
                  id="type"
                  labelId="typeLabel"
                  name="type"
                >
                  <MenuItem value="Exterior">Exterior</MenuItem>
                  <MenuItem value="Heating">Heating</MenuItem>
                  <MenuItem value="Plumbing">Plumbing</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>              
              </Grid>
              <Grid item xs={12}>
                <TextareaAutosize
                  className={classes.textarea}
                  defaultValue={request.summary}
                  id="summary"
                  label="Summary text"
                  name="summary"
                  placeholder="Type summary here"
                />              
              </Grid>
              <Grid item xs={12}>
                <TextareaAutosize
                  className={classes.textarea}
                  defaultValue={request.details}
                  id="details"
                  label="Details text"
                  name="details"
                  placeholder="Type details here"
                />                
              </Grid>                        
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              type="submit"
            >
              Save Post
            </Button>
            <Button onClick={onCancel}>
              Cancel
            </Button>
          </CardActions>
        </form>
      </Card>
    );
  } else {
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
  }
};