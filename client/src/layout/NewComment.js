import React from "react";
import axios from "axios";
import {
  Button,
  CardContent,
  CardActions,
  TextareaAutosize,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  textarea: {
    width: "100%",
  },
});

export default function NewComment({ post, setPosts, authUser }) {
  const classes = useStyles();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        text: e.target.text.value,
      }
      const response = await axios.post(
        "/api/posts/comment/" + post._id,
        body,
        { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}
      );
      // Replace placeholder comments with those returned by server with real id on new comment.
      setPosts(prevPosts => {
        for (let prevPost of prevPosts) {
          if (prevPost._id === post._id) {
            prevPost.comments = response.data;
          }
        }
        // Return a new array object, not just the changed array, to force render.
        return [ ...prevPosts ];
      });
    } catch (err) {
      console.error(err.message);
    }    
  };

  return (
    <form onSubmit={onSubmit}>
      <CardContent>
        <TextareaAutosize
          className={classes.textarea}
          id="text"
          label="Comment text"
          name="text"
          placeholder="Type comment here"
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
};