import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  CardActions,
  CardContent,
  Grid,
  TextareaAutosize,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  textarea: {
    width: "100%",
  },
});

export default function Comment({ comment, isNew, post, setPosts, authUser }) {
  const classes = useStyles();

  if (isNew) {
    // Define template new comment that fills form fields with default values.
    comment = { text: "" };
  }
  
  // New comments should be in edit mode by default, else view mode is default.
  const [isEditing, setIsEditing] = useState(isNew);

  const onEdit = () => {
    setIsEditing(true);
  }

  const onDelete = async () => {
    // Delete comment from server.
    const response = await axios.delete(
      "/api/posts/comment/" + post._id + "/" + comment._id,
      { headers: { "x-auth-token": authUser.token }}
    );

    // Replace comments with those returned by server with this comment deleted.
    setPosts(prevPosts => {
      for (let prevPost of prevPosts) {
        if (prevPost._id === post._id) {
          prevPost.comments = response.data;
        }
      }
      // Return a new array object, not just the changed array, to force render.
      return [ ...prevPosts ];
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
          "/api/posts/comment/" + post._id,
          body,
          { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}
        );
      } else {
        response = await axios.patch(
          "/api/posts/comment/" + post._id + "/" + comment._id,
          body,
          { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}
        );
      }

      // Replace comments with those returned by server with real id on new comment.
      setPosts(prevPosts => {
        for (let prevPost of prevPosts) {
          if (prevPost._id === post._id) {
            prevPost.comments = response.data;
          }
        }
        // Return a new array object, not just the changed array, to force render.
        return [ ...prevPosts ];
      });

      // Return to viewing modes (new comment gets different id on save, so not needed).
      if (!isNew) {
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err.message);
    }    
  };

  if (isEditing) {
    // What to show if editing a new or existing comment.
    return (
      <form onSubmit={onSubmit}>
        <CardContent>
          <TextareaAutosize
            className={classes.textarea}
            id="text"
            label="Comment text"
            name="text"
            placeholder="Type comment here"
            defaultValue={comment.text}
          />
        </CardContent>
        <CardActions>
          <Button
            type="submit"
          >
            Save Comment
          </Button>
        </CardActions>
      </form>
    );
  } else {
    // What to show if viewing an existing comment.
    return (
      <Grid container>
        <Grid item xs={6}>
          <p><strong>{comment.name}</strong></p>
        </Grid> 
        <Grid item xs={6}>
          <p>{(new Date(comment.date)).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>
        </Grid>
        <Grid item xs={12}>
          <p>{comment.text}</p>
        </Grid>
        { // Only user who created comment or staff can edit.
          (authUser.isStaff || authUser._id === comment.user) && 
          <Grid item xs={12}>
            <CardActions>
              <Button onClick={onEdit}>
                Edit comment
              </Button>
              <Button onClick={onDelete}>
                Delete comment
              </Button>
            </CardActions>
          </Grid>
        }
      </Grid>      
    );
  }
};