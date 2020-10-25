import React, { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  Grid,
  Typography,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

export default function Location({ locationNumber, vacancies }) {
  const [expanded, setExpanded] = useState(false);

  const onExpandedClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <CardMedia
            component='img'
            alt={'Apartment ' + locationNumber}
            height='140'
            image={'/images/location' + locationNumber + '.jpg'}
            title={'Apartment ' + locationNumber}
          />
          <CardContent>
            <Typography variant='h5' component='h2'>
              Apartment {locationNumber}
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
            {vacancies.length > 0 &&
              <Button size='small' color='primary' onClick={onExpandedClick} aria-expanded={expanded}>
                Vacancies
                {expanded ?
                  <ArrowDropUpIcon />
                :
                  <ArrowDropDownIcon />
                }
              </Button>
            }
            <Button style={{ textAlign: "right" }} size='small' color='primary'>
              Contact Us
            </Button>
          </CardActions>
          <Collapse in={expanded} mountOnEnter unmountOnExit>
            <CardContent>
              {
                vacancies.map(vacancy =>
                  <p>{vacancy.number}</p>
                )
              }
            </CardContent>
          </Collapse>
        </Card>
      </Grid>
    </Grid>  
  );
};