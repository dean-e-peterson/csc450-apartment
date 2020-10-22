import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Grid,
  TextareaAutosize,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from "@material-ui/core/styles";
import Comment from "./Comment";

const useStyles = makeStyles({
  textarea: {
    width: "100%",
  },
});

export default function Post({ post, isNew, setPosts, authUser }) {
  const classes = useStyles();

  if (isNew) {
    // Define template new post that fills form fields with default values.
    post = { text: "" };
  }  

  // New posts should be in edit mode by default, else view mode is default.
  const [isEditing, setIsEditing] = useState(isNew);  

  const [expanded, setExpanded] = useState(false);

  const onExpandedClick = () => {
    setExpanded(!expanded);
  };

  const onNewReply = () => {
    setPosts(prevPosts => {
      // Get this post from array of all posts.
      const thisPost = prevPosts.filter(prevPost => prevPost._id === post._id)[0];
      // Append a placeholder comment to the end.
      thisPost.comments.push({ _id: "new" });
      // Return a new array object, not just the changed array, to force render.
      return [ ...prevPosts ];
    });
    setExpanded(true);
  }

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

  if (isEditing) {
    // What to show if editing a new or existing comment.
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
  } else {
    // What to show if viewing an existing comment.
    return (
      <Card>
        <CardContent>
          <Typography component="div">
            <Grid container>
              <Grid item xs={6}>
                <p><strong>{post.name}</strong></p>
              </Grid> 
              <Grid item xs={6}>
                <p>{(new Date(post.date)).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>
              </Grid>
              <Grid item xs={12}>
                <p>{post.text}</p>
              </Grid>
            </Grid>
          </Typography>
        </CardContent>
        <Collapse in={expanded} mountOnEnter unmountOnExit>
          <CardContent>
            <Typography component="div">
              {
                post.comments.map(comment =>
                  comment._id === "new" ?
                    <Comment isNew={true} key={comment._id} post={post} setPosts={setPosts} authUser={authUser} />
                  :
                    <Comment key={comment._id} comment={comment} post={post} setPosts={setPosts} authUser={authUser}/>
                )
              }
            </Typography>
          </CardContent>
        </Collapse>
        <CardActions>
          <Button onClick={onNewReply}>
            New Reply
          </Button>
          <Button onClick={onExpandedClick} aria-expanded={expanded}>
            Show Replies
            <ExpandMoreIcon />
          </Button>
        </CardActions>
      </Card>
    );
  }
};