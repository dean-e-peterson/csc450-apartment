import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Card, CardContent, Grid, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';
import FacebookIcon from '@material-ui/icons/Facebook';

const useStyles = makeStyles((theme) => ({}));

export default function Social({ authUser }) {
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [social, setSocial] = useState([]);

  const onEdit = () => {
    setIsEditing(true);
  };

  const onCancel = () => {
    setIsEditing(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (authUser) {
        const body = {
          youtube: e.target.youtube.value,
          twitter: e.target.twitter.value,
          facebook: e.target.facebook.value,
        };
        const response = await axios.post('/api/social', body, {
          headers: {
            'Content-type': 'application/json',
            'x-auth-token': authUser.token,
          },
        });
        const social = response.data;
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const getSocial = async () => {
      try {
        const response = await axios.get('/api/social', {
          headers: { 'Content-type': 'application/json' },
        });
        setSocial(response.data);
      } catch (err) {
        console.error(err.message);
      }
    };
    getSocial();
  }, [social]);

  if (isEditing) {
    // Logged in as staff.
    return (
      <Card>
        <form onSubmit={onSubmit}>
          <CardContent>
            <Grid container>
              <Grid item xs={4}>
                <TextField
                  autoFocus
                  defaultValue={social.youtube}
                  id='youtube'
                  label='Youtube URL'
                  name='youtube'
                  placeholder='Youtube URL'
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  defaultValue={social.twitter}
                  id='twitter'
                  label='Twitter URL'
                  name='twitter'
                  placeholder='Twitter URL'
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  defaultValue={social.facebook}
                  id='facebook'
                  label='Facebook URL'
                  name='facebook'
                  placeholder='Facebook URL'
                />
              </Grid>
              <Grid item xs={1}>
                <Button type='submit'>
                  <SaveIcon />
                </Button>
              </Grid>
              <Grid item xs={1}>
                <Button onClick={onCancel}>
                  <CancelIcon />
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </form>
      </Card>
    );
  } else if (authUser && authUser.isStaff) {
    return (
      <Fragment>
        <IconButton color='inherit'>
          <YouTubeIcon />
        </IconButton>

        <IconButton color='inherit'>
          <TwitterIcon />
        </IconButton>

        <IconButton color='inherit'>
          <FacebookIcon />
        </IconButton>

        <Button onClick={onEdit} color='inherit'>
          <EditIcon />
        </Button>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <IconButton color='inherit'>
          <YouTubeIcon />
        </IconButton>

        <IconButton color='inherit'>
          <TwitterIcon />
        </IconButton>

        <IconButton color='inherit'>
          <FacebookIcon />
        </IconButton>

        <Button onClick={onEdit} color='inherit'>
          <EditIcon />
        </Button>
      </Fragment>
    );
  }
}
