import React, { useState, Fragment } from "react";
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
    post = { _id: "new", text: "" };
  }  

  // New posts should be in edit mode by default, else view mode is default.
  const [isEditing, setIsEditing] = useState(isNew);  

  const [expanded, setExpanded] = useState(false);

  const onExpandedClick = () => {
    setExpanded(!expanded);
  };

  const onEdit = () => {
    setIsEditing(true);
  }

  const onDelete = async () => {
    // Delete post from server.
    await axios.delete(
      "/api/posts/" + post._id,
      { headers: { "x-auth-token": authUser.token }}
    );

    // Remove post from UI state.
    setPosts(prevPosts => prevPosts.filter(prevPost => 
      !(prevPost._id === post._id)
    ));
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        text: e.target.text.value,
      }

      // Save new or edited post to server.
      let response;
      if (isNew) {      
        response = await axios.post(
          "/api/posts",
          body,
          { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}
        );
      } else {
        response = await axios.patch(
          "/api/posts/" + post._id,
          body,
          { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}
        );
      }

      // Replace placeholder new post with actual one returned by server with real id.
      setPosts(prevPosts => prevPosts.map(prevPost =>
        prevPost._id === post._id ? response.data : prevPost
      ));

      if (!isNew) {
        // Return to viewing mode (new post gets different id on save, so not needed).
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const onNewReply = () => {
    setPosts(prevPosts => {
      // Get this post from array of all posts.
      const thisPost = prevPosts.find(prevPost => prevPost._id === post._id);
      // Append a placeholder comment to the end.
      thisPost.comments.push({ _id: "new" });
      // Return a new array object, not just the changed array, to force render.
      return [ ...prevPosts ];
    });
    setExpanded(true);
  }

  if (isEditing) {
    // What to show if editing a new or existing comment.
    return (
      <Card>
        <form onSubmit={onSubmit}>
          <CardContent>
            <TextareaAutosize
              className={classes.textarea}
              defaultValue={post.text}
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
          { // Only user who created post or staff can edit.
            (authUser.isStaff || authUser._id === post.user) &&   
            <Button onClick={onEdit}>
              Edit post
            </Button>
          }          
          { // Only user who created post or staff can delete, and only if no replies.
            (authUser.isStaff || authUser._id === post.user) && post.comments.length === 0 && 
            <Button onClick={onDelete}>
              Delete post
            </Button>
          }
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