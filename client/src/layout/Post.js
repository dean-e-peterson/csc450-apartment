import React, { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
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
          <p>{post.name} at {post.date}</p>
          <p>{post.text}</p>
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
          {
            post.comments.map(comment =>
              comment.text
            )
          }
        </CardContent>
      </Collapse>
    </Card>
  );
};