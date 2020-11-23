import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Button,
  CardActions,
  CardContent,
  Grid,
  TextareaAutosize,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { setAppEditing } from "../utils/EditingHandler";

const useStyles = makeStyles(theme => ({
  textarea: {
    width: "100%",
    border: "solid 1px rgba(0, 0, 0, .23)", // Make look like other inputs.
    borderRadius: "4px",
    padding: "4px",
  },
  commentBackground: {
    backgroundColor: "#dddddd",
    borderTop: "1px solid #999999"
  },
}));

export default function Comment({ comment, isNew, apiRoute, parent, setParents, authUser, setScrollRef }) {
  const classes = useStyles();

  if (isNew) {
    // Define template new comment that fills form fields with default values.
    comment = { text: "" };
  }

  // For scrolling form into view, especially when clicking New Reply on parent.
  const formRef = useRef();

  // New comments should be in edit mode by default, else view mode is default.
  const [isEditing, setIsEditing] = useState(isNew);

  const onEdit = () => {
    setIsEditing(true);
    setAppEditing(true);
  }

  const onDelete = async () => {
    // Delete comment from server.
    const response = await axios.delete(
      "/api/" + apiRoute + "/comment/" + parent._id + "/" + comment._id,
      { headers: { "x-auth-token": authUser.token }}
    );

    // Replace comments with those returned by server with this comment deleted.
    setParents(prevParents => {
      for (let prevParent of prevParents) {
        if (prevParent._id === parent._id) {
          prevParent.comments = response.data;
        }
      }
      // Return a new array object, not just the changed array, to force render.
      return [ ...prevParents ];
    });
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        text: e.target.text.value,
      }

      // Save new or edited comment to server.
      let response;
      if (isNew) {
        response = await axios.post(
          "/api/" + apiRoute + "/comment/" + parent._id,
          body,
          { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}
        );
      } else {
        response = await axios.patch(
          "/api/" + apiRoute + "/comment/" + parent._id + "/" + comment._id,
          body,
          { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}
        );
      }

      // Replace comments with those returned by server with real id on new comment.
      setParents(prevParents => {
        for (let prevParent of prevParents) {
          if (prevParent._id === parent._id) {
            prevParent.comments = response.data;
          }
        }
        // Return a new array object, not just the changed array, to force render.
        return [ ...prevParents ];
      });

      if (!isNew) {
        // Return to viewing mode (new comment gets different id on save, so not needed).
        setIsEditing(false);
      }
      setAppEditing(false);
    } catch (err) {
      console.error(err.message);
    }    
  };

  const onCancel = () => {
    if (isNew) {
      // Remove placeholder.
      setParents(prevParents => {
        // Get this parent from array of all parents.
        const thisParent = prevParents.find(prevParent => prevParent._id === parent._id);
        // Remove placeholder comment at end.
        thisParent.comments.pop();
        // Return a new array object, not just the changed array, to force render.
        return [ ...prevParents ];
      });
    }

    setIsEditing(false);
    setAppEditing(false);
  }

  if (isEditing) {
    // What to show if editing a new or existing comment.
    return (
      <div className={classes.commentBackground}>
        <form onSubmit={onSubmit} ref={formRef}>
          <CardContent>
            <p><strong>{comment.name}</strong></p>
            <TextareaAutosize
              autoFocus
              className={classes.textarea}
              defaultValue={comment.text}
              id="text"
              label="Reply text"
              name="text"
              placeholder="Type reply here"
              onFocus={() => setScrollRef(formRef)}
            />
          </CardContent>
          <CardActions>
            <Button
              type="submit"
            >
              Save Reply
            </Button>
            <Button onClick={onCancel}>
              Cancel
            </Button>
          </CardActions>
        </form>
      </div>
    );
  } else {
    // What to show if viewing an existing comment.
    return (
      <div className={classes.commentBackground}>
        <CardContent>
          <Grid container>
            <Grid item xs={6}>
              <strong>{comment.name}</strong>
            </Grid> 
            <Grid item xs={6}>
              {(new Date(comment.date)).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}
            </Grid>
            <Grid item xs={12}>
              {
                comment.text.split("\n").map(para =>
                  <p>{para}</p>
                )
              }
            </Grid>
          </Grid>
        </CardContent>
        { // Only user who created comment or staff can edit.
          (authUser.isStaff || authUser._id === comment.user) && 
          <CardActions>
            <Grid container>
              <Grid item xs={12}>
                <Button onClick={onEdit}>
                  Edit reply
                </Button>
                <Button onClick={onDelete}>
                  Delete reply
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        }
      </div>
    );
  }
};