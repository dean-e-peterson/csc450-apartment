import React, { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Grid,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Comment from "./Comment";

export default function Post({ post, setPosts, authUser }) {
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
};