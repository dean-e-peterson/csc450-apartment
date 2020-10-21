import React from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextareaAutosize,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  textarea: {
    width: "100%",
  },
});

export default function NewPost({ setPosts, authUser }) {
  const classes = useStyles();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        text: e.target.text.value,
      }
      const response = await axios.post(
        "/api/posts",
        body,
        { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}
      );
      // Replace placeholder new post with actual one returned by server with real id.
      setPosts(prevPosts => prevPosts.map(post =>
        post._id === "new" ? response.data : post
      ));
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <CardContent>
          <TextareaAutosize
            className={classes.textarea}
            id="text"
            label="Post text"
            name="text"
            placeholder="Type post here"
          />
        </CardContent>
        <CardActions>
          <Button
            type="submit"
          >
            Save Post
          </Button>
        </CardActions>
      </form>
    </Card>

  );
};