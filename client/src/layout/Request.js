import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
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
import createAlert from "../utils/createAlert";
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

  const [formData, setFormData] = useState(request);
  const [isEditing, setIsEditing] = useState(request._id.substr(0, 3) === "new");
  const [scrollRef, setScrollRef] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const onExpandedClick = () => {
    setExpanded(!expanded);
  };

  const onChange = (e) => {
    e.persist();
    setFormData(prevFormData => ({ ...prevFormData, [e.target.name]: e.target.value }));
  }

  const onCompleted = async () => {
    setFormData(prevFormData => ({ ...prevFormData, status: "Completed" }));
    const body = {
      status: "Completed",
      unit: formData.unit,
      user: formData.user,
      type: formData.type,
      summary: formData.summary,
      details: formData.details,
    }
    await save(body);
    await createAlert(
      authUser, 
      formData.user,
      "The following maintenance request has been completed: " + formData.summary,
      "/maintenance",
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const body = {
      status: formData.status,
      unit: formData.unit,
      user: formData.user,
      type: formData.type,
      summary: formData.summary,
      details: formData.details,
    }
    await save(body);
  }

  const save = async (body) => {
    try {
      // Save new or edited request to server.
      let response;
      if (request._id.substr(0, 3) === "new") {      
        response = await axios.post(
          "/api/requests",
          body,
          { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}
        );
      } else {
        response = await axios.patch(
          "/api/requests/" + request._id,
          body,
          { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}
        );
      }

      // Replace placeholder new request with actual one returned by server with real id.
      setRequests(prevRequests => prevRequests.map(prevRequest =>
        prevRequest._id === request._id ? response.data : prevRequest
      ));

      if (!(request._id.substr(0, 3) === "new")) {
        // Return to viewing mode (new request gets different id on save, so not needed).
        setIsEditing(false);
      }
      setAppEditing(false);
    } catch (err) {
      console.error(err.message);
    }
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
        <form onSubmit={onSubmit}>
          <CardContent>
            <Grid container spacing={2}>
              {
                authUser.isStaff ?
                  <Fragment>
                    <Grid item xs={12} md={3}>
                      <InputLabel id="unitLabel">
                        Unit:
                      </InputLabel>
                      <Select
                        id="unit"
                        labelId="unitLabel"
                        onChange={onChange}
                        name="unit"
                        value={formData.unit}
                      >
                        {
                          units.map(unit =>
                            <MenuItem value={unit._id}>
                              {unit.location.name + " " + unit.number}
                            </MenuItem>
                          )
                        }
                      </Select>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <InputLabel id="userLabel">
                        User:
                      </InputLabel>
                      <Select
                        id="user"
                        labelId="userLabel"
                        onChange={onChange}
                        name="user"
                        value={formData.user}
                      >
                        {
                          users.map(user =>
                            <MenuItem value={user._id}>
                              {user.firstName + " " + user.lastName}
                            </MenuItem>
                          )
                        }
                      </Select>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      {(new Date(request.date)).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <strong>{"Status: " + request.status}</strong>
                    </Grid>
                  </Fragment>
                :
                  <Fragment>
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
                    <Grid item xs={12} md={5}>
                      {(new Date(request.date)).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <strong>{"Status: " + request.status}</strong>
                    </Grid>                    
                  </Fragment>
              }
              <Grid item xs={12}>
                <InputLabel id="typeLabel">
                  Type:
                </InputLabel>
                <Select
                  defaultValue={request.type}
                  id="type"
                  labelId="typeLabel"
                  onChange={onChange}
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
                  id="summary"
                  label="Summary text"
                  name="summary"
                  onChange={onChange}
                  placeholder="Type summary here"
                  value={formData.summary}
                />              
              </Grid>
              <Grid item xs={12}>
                <TextareaAutosize
                  className={classes.textarea}
                  id="details"
                  label="Details text"
                  name="details"
                  onChange={onChange}
                  placeholder="Type details here"
                  value={formData.details}
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
              <p><strong>{request.summary}</strong></p>
            </Grid>
            <Grid item xs={12}>
              {
                request.details.split("\n").map(para =>
                  <p>{para}</p>
                )
              }
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
          {
            authUser.isStaff && (formData.status !== "Completed") &&
            <Button onClick={onCompleted}>
              Mark Completed
            </Button>
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