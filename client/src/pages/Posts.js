import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { setAppEditing } from "../utils/EditingHandler";
import Post from "../layout/Post";

const useStyles = makeStyles(theme => ({
  heading: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  newPostButton: {
    margin: theme.spacing(2)
  }
}));

export default function Posts({ authUser }) {
  const classes = useStyles();

  const [posts, setPosts] = useState([]);

  const onNewPost = () => {
    setPosts(prevPosts => {
      // Add placeholder new post.
      prevPosts.unshift({ _id: "new" });
      // Return a new array object, not just the changed array, to force render.
      return [...prevPosts];
    });
    // Prevent leaving page with warning that user may have unsaved changes.
    setAppEditing(true);
  };

  useEffect(() => {
    const getPosts = async () => {
      try {
        if (authUser) {
          // Wait for user authentication.
          const response = await axios.get("/api/posts", {
            headers: { "x-auth-token": authUser.token }
          });
          setPosts(response.data);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    getPosts();
  }, [authUser]); // [authUser] means only re-run when authUser changes.

  return (
    <Fragment>
      <Typography variant='h5' component='h2' className={classes.heading}>
        Bulletin Board
      </Typography>
      <Button
        onClick={onNewPost}
        variant='outlined'
        className={classes.newPostButton}
      >
        New Post
      </Button>
      {posts.map(post =>
        post._id === "new" ? (
          <Post
            isNew={true}
            key={post._id}
            post={post}
            setPosts={setPosts}
            authUser={authUser}
          />
        ) : (
          <Post
            key={post._id}
            post={post}
            setPosts={setPosts}
            authUser={authUser}
          />
        )
      )}
    </Fragment>
  );
}
