import React, { useState, useEffect } from "react";
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

export default function Post({ post, isNew, setPosts, authUser }) {
  const classes = useStyles();

  if (isNew) {
    // Define template new post that fills form fields with default values.
    post = { _id: "new", text: "" };
  }  

  // New posts should be in edit mode by default, else view mode is default.
  const [isEditing, setIsEditing] = useState(isNew);  
  const [scrollRef, setScrollRef] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const onExpandedClick = () => {
    setExpanded(!expanded);
  };

  const onEdit = () => {
    setIsEditing(true);
    setAppEditing(true);
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
      setAppEditing(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  const onCancel = () => {
    if (isNew) {
      // Remove placeholder post.
      setPosts(prevPosts => prevPosts.filter(prevPost =>
        prevPost._id !== "new"
      ));
    }

    setIsEditing(false);
    setAppEditing(false);
  }

  const onNewReply = () => {
    setPosts(prevPosts => {
      // Warn if leave the page when editing page.
      setAppEditing(true);
      // Get this post from array of all posts.
      const thisPost = prevPosts.find(prevPost => prevPost._id === post._id);
      // Append a placeholder comment to the end.
      thisPost.comments.push({ _id: "new" });
      // Return a new array object, not just the changed array, to force render.
      return [ ...prevPosts ];
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
    // What to show if editing a new or existing comment.
    return (
      <Card>
        <form onSubmit={onSubmit}>
          <CardContent>
            <Typography component="div">
              <p><strong>{post.name}</strong></p>
              <TextareaAutosize
                autoFocus
                className={classes.textarea}
                defaultValue={post.text}
                id="text"
                label="Post text"
                name="text"
                placeholder="Type post here"
              />
            </Typography>
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
    // What to show if viewing an existing comment.
    return (
      <Card>
        <CardContent>
          <Typography component="div">
            <Grid container>
              <Grid item xs={6}>
                <strong>{post.name}</strong>
              </Grid> 
              <Grid item xs={6}>
                {(new Date(post.date)).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}
              </Grid>
              <Grid item xs={12}>
                {
                  post.text.split("\n").map(para =>
                    <p>{para}</p>
                  )
                }
              </Grid>
            </Grid>
          </Typography>
        </CardContent>
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
          { post.comments.length > 0 &&
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
            <Typography component="div">
              {
                post.comments.map(comment =>
                  comment._id === "new" ?
                    <Comment
                      isNew={true}
                      key={comment._id}
                      apiRoute="posts"
                      parent={post}
                      setParents={setPosts}
                      authUser={authUser}
                      setScrollRef={setScrollRef}
                    />
                  :
                    <Comment
                      key={comment._id}
                      comment={comment}
                      apiRoute="posts"                      
                      parent={post}
                      setParents={setPosts}
                      authUser={authUser}
                      setScrollRef={setScrollRef}
                    />
                )
              }
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
};