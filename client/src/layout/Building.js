import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

export default function Building({ buildingNumber }) {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <CardMedia
            component='img'
            alt={'Apartment ' + buildingNumber}
            height='140'
            image={'/images/building' + buildingNumber + '.jpg'}
            title={'Apartment ' + buildingNumber}
          />
          <CardContent>
            <Typography variant='h5' component='h2'>
              Apartment {buildingNumber}
            </Typography>
            <Typography variant='body2' color='textSecondary' component='p'>
              Beautiful 1, 2 and 3 bedroom apartments - full of amenities!
              Underground Parking
            </Typography>
          </CardContent>
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
    </Grid>  
  );
};