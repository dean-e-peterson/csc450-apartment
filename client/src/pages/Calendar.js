import React, { useState, useEffect, Fragment } from "react";
import "./Calendar.css";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { Button, Typography } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";

import Grid from "@material-ui/core/Grid";
import axios from "axios";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // root: {
    //   maxWidth:
    // },
    media: {
      height: 0,
      paddingTop: "56.25%" // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: "rotate(180deg)"
    },
    avatar: {
      backgroundColor: red[500]
    }
  })
);

export default function Calendar({ authUser, setAuthUser }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  //const [authUser, setAuthUser] = useState([]);{

  const [events, setEvents] = useState([]);

  return (
    <Grid container>
      {authUser && authUser.isStaff && (
        <Button // Logged in as staff.
          //   onClick={}
          variant='outlined'
          //   className={}
        >
          New Post
        </Button>
      )}

      <Grid item xs={12}>
        <Typography variant='h5' component='h2' className={classes.heading}>
          Events Calendar
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Card className={classes.root} xs={12}>
          <CardHeader
            action={
              <IconButton>
                <DeleteIcon />
              </IconButton>
            }
            title='Event 1'
            subheader=''
          />

          <CardContent>
            <Typography variant='body2' color='textPrimary' component='p'>
              Click drop down arrow for details
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={expanded} timeout='auto' unmountOnExit>
            <CardContent>
              <Typography paragraph>Date: October 29th, 2020 </Typography>
              <Typography paragraph>Location: Apartment 1 </Typography>
              <Typography paragraph>Time: 4pm-7m </Typography>
              <Typography paragraph>
                We're having a potluck for everyone! Our main dish will be
                CHILLI, the cold weather is comming! Burrr
              </Typography>
              <Typography paragraph>
                Feel free to bring your favorite dishes :)
              </Typography>
            </CardContent>
            <CardContent>
              <Typography paragraph>Date: October 31th, 2020 </Typography>
              <Typography paragraph>Location: Apartment 2 </Typography>
              <Typography paragraph>Time: 5pm-8pm </Typography>
              <Typography paragraph>Spooky Festivities</Typography>
              <Typography paragraph>
                We're having a gathering to handout candy to the children &
                costume contest!
              </Typography>
              <Typography paragraph>Bring the your best costumes!</Typography>
            </CardContent>
          </Collapse>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card className={classes.root} xs={12}>
          <CardHeader
            action={
              <IconButton>
                <DeleteIcon />
              </IconButton>
            }
            title='Event 2'
            subheader=''
          />

          <CardContent>
            <Typography variant='body2' color='textPrimary' component='p'>
              Click drop down arrow for details
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label='show more'
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={expanded} timeout='auto' unmountOnExit>
            <CardContent>
              <Typography paragraph>Date: October 29th, 2020 </Typography>
              <Typography paragraph>Location: Apartment 1 </Typography>
              <Typography paragraph>Time: 4pm-7m </Typography>

              <Typography paragraph>
                We're having a potluck for everyone! Our main dish will be
                CHILLI, the cold weather is comming! Burrr
              </Typography>
              <Typography paragraph>
                Feel free to bring your favorite dishes :)
              </Typography>
            </CardContent>
            <CardContent>
              <Typography paragraph>Date: October 31th, 2020 </Typography>
              <Typography paragraph>Location: Apartment 2 </Typography>
              <Typography paragraph>Time: 5pm-8pm </Typography>
              <Typography paragraph>Spooky Festivities</Typography>
              <Typography paragraph>
                We're having a gathering to handout candy to the children &
                costume contest!
              </Typography>
              <Typography paragraph>Bring the your best costumes!</Typography>
            </CardContent>
          </Collapse>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card className={classes.root} xs={12}>
          <CardHeader
            action={
              <IconButton>
                <DeleteIcon />
              </IconButton>
            }
            title='Event 3'
            subheader=''
          />

          <CardContent>
            <Typography variant='body2' color='textPrimary' component='p'>
              Click drop down arrow for details
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label='show more'
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={expanded} timeout='auto' unmountOnExit>
            <CardContent>
              <Typography paragraph>Date: October 29th, 2020 </Typography>
              <Typography paragraph>Location: Apartment 1 </Typography>
              <Typography paragraph>Time: 4pm-7m </Typography>

              <Typography paragraph>
                We're having a potluck for everyone! Our main dish will be
                CHILLI, the cold weather is comming! Burrr
              </Typography>
              <Typography paragraph>
                Feel free to bring your favorite dishes :)
              </Typography>
            </CardContent>
            <CardContent>
              <Typography paragraph>Date: October 31th, 2020 </Typography>
              <Typography paragraph>Location: Apartment 2 </Typography>
              <Typography paragraph>Time: 5pm-8pm </Typography>
              <Typography paragraph>Spooky Festivities</Typography>
              <Typography paragraph>
                We're having a gathering to handout candy to the children &
                costume contest!
              </Typography>
              <Typography paragraph>Bring the your best costumes!</Typography>
            </CardContent>
          </Collapse>
        </Card>
      </Grid>
    </Grid>
  );
}
