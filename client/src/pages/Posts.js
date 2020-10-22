import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import {
  Button,
  Typography,
} from "@material-ui/core"
import Post from "../layout/Post";

export default function Posts({ authUser }) {
  const [posts, setPosts] = useState([]);

  const onNewPost = () => {
    setPosts(prevPosts => {
      // Add placeholder new post.
      prevPosts.unshift({ _id: "new" });
      // Return a new array object, not just the changed array, to force render.
      return [ ...prevPosts ];
    });
  };

  useEffect(() => {
    const getPosts = async () => {
      try {
        if (authUser) { // Wait for user authentication.
          const response = await axios.get(
            "/api/posts",
            { headers: { "x-auth-token": authUser.token }}
          );
          setPosts(response.data);
        }
      } catch (err) {
        console.error(err.message);
      }
    }
    getPosts();
  }, [authUser]); // [authUser] means only re-run when authUser changes.

  return (
    <Fragment>
      <Typography variant='h5' component='h2'>
        Bulletin Board
      </Typography>
      <Button onClick={onNewPost} variant="outlined">New Post</Button>
      {
        posts.map(post =>
          post._id === "new" ?
            <Post isNew={true} key={post._id} post={post} setPosts={setPosts} authUser={authUser} />
          :
            <Post key={post._id} post={post} setPosts={setPosts} authUser={authUser} />
        )
      }
    </Fragment>
  )
};