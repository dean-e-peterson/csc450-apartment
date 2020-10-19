import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import {
  Typography,
} from "@material-ui/core"
import Post from "../layout/Post";

export default function Posts({ authUser }) {
  const [posts, setPosts] = useState([]);
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
      {
        posts.map(post => 
          <Post key={post._id} post={post} authUser={authUser} />
        )
      }
    </Fragment>
  )
};