import React, { useState, Fragment } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Grid,
  Typography,
} from "@material-ui/core"
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default function Post({ post, authUser }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandedClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card key={post._id}>
      <CardContent>
        <Typography component="div">
          <Grid container>
            <Grid item xs={6}>
              <p><strong>{post.name}</strong></p>
            </Grid> 
            <Grid item xs={6}>
              <p>at {(new Date(post.date)).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>
            </Grid>
            <Grid item xs={12}>
              <p>{post.text}</p>
            </Grid>
          </Grid>
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={handleExpandedClick} aria-expanded={expanded}>
          See comments
          <ExpandMoreIcon />
        </Button>
      </CardActions>
      <Collapse in={expanded} mountOnEnter unmountOnExit>
        <CardContent>
          <Typography>
            <Grid container>
              {
                post.comments.map(comment =>
                  <Fragment>
                    <Grid item xs={6}>
                      <p><strong>{comment.name}</strong></p>
                    </Grid> 
                    <Grid item xs={6}>
                      <p>at {(new Date(comment.date)).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>
                    </Grid>
                    <Grid item xs={12}>
                      <p>{comment.text}</p>
                    </Grid>
                  </Fragment>
                )
              }
            </Grid>
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};