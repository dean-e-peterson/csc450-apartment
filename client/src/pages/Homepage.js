import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
}));

export default function Homepage() {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <CardActionArea>
            <CardMedia
              component='img'
              alt='Apartment 1'
              height='140'
              image="/images/pexels-george-becker-129494.jpg"
              title='Apartment 1'
            />
            <CardContent>
              <Typography variant='h5' component='h2'>
                Apartment 1
              </Typography>
              <Typography variant='body2' color='textSecondary' component='p'>
                Beautiful 1, 2 and 3 bedroom apartments - full of amenities!
                Underground Parking
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size='small' color='primary'>
              Apply
            </Button>
            <Button size='small' color='primary'>
              Vacancies
              <ArrowDropDownIcon />
            </Button>
            <Button style={{ textAlign: "right" }} size='small' color='primary'>
              Contact Us
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardActionArea>
            <CardMedia
              component='img'
              alt='Apartment 2'
              height='140'
              image='/images/pexels-sevenstorm-juhaszimrus-981916.jpg'
              title='Apartment 2'
            />
            <CardContent>
              <Typography gutterBottom variant='h5' component='h2'>
                Apartment 2
              </Typography>
              <Typography variant='body2' color='textSecondary' component='p'>
                Beautiful 1, 2 and 3 bedroom apartments - full of amenities!
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size='small' color='primary'>
              Apply
            </Button>
            <Button size='small' color='primary'>
              Vacancies
              <ArrowDropDownIcon />
            </Button>
            <Button
              style={{ alignSelf: "flex-end" }}
              size='small'
              color='primary'
            >
              Contact Us
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}
