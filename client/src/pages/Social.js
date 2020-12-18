import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, Grid, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';
import FacebookIcon from '@material-ui/icons/Facebook';

export default function Social({ authUser }) {
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
        const response = await axios.get(
          '/api/social/5f9f515982a6331b2400d53f',
          {
            headers: { 'Content-type': 'application/json' },
          }
        );
        setSocial(response.data);
        //console.log(response.data);
      } catch (err) {
        console.error(err.message);
      }
    };
    getSocial();
  }, []);

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
      <Grid container direction='row' justify='flex-end' alignItems='center'>
        <IconButton color='inherit'>
          <a href={social.social && social.social.youtube}>
            <YouTubeIcon />
          </a>
        </IconButton>

        <IconButton color='inherit'>
          <a href={social.social && social.social.twitter}>
            <TwitterIcon />
          </a>
        </IconButton>

        <IconButton color='inherit'>
          <a href={social.social && social.social.facebook}>
            <FacebookIcon />
          </a>
        </IconButton>

        <Button onClick={onEdit} color='inherit'>
          <EditIcon />
        </Button>
      </Grid>
    );
  } else {
    return (
      <Grid container direction='row' justify='flex-end' alignItems='center'>
        <IconButton color='inherit'>
          <a href={social.social && social.social.youtube}>
            <YouTubeIcon />
          </a>
        </IconButton>

        <IconButton color='inherit'>
          <a href={social.social && social.social.twitter}>
            <TwitterIcon color='inherit' />
          </a>
        </IconButton>

        <IconButton color='inherit'>
          <a href={social.social && social.social.facebook}>
            <FacebookIcon />
          </a>
        </IconButton>
      </Grid>
    );
  }
}
