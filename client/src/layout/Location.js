import React, { useState } from "react";
import { useHistory } from "react-router-dom";
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
import Vacancy from "./Vacancy";

export default function Location({ location, vacancies, authUser }) {
  const [expanded, setExpanded] = useState(false);
  const history = useHistory();

  const onExpandedClick = () => {
    setExpanded(!expanded);
  };

  const onApplyClick = () => {
    if (authUser) {
      history.push('/apply');
    } else {
      history.push('/register');
    }
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <CardMedia
            component='img'
            alt={location.name}
            height='140'
            image={'/images/location' + location.homePageOrder + '.jpg'}
            title={location.name}
          />
          <CardContent>
            <Typography variant='h5' component='h2'>
              {location.name}
            </Typography>
            <Typography variant='body2' color='textSecondary' component='p'>
              {location.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size='small' color='primary' onClick={onApplyClick}>
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
              <Typography color='textSecondary' component="div">
                <ul>
                  {
                    vacancies.map(vacancy =>
                      <Vacancy key={vacancy._id} vacancy={vacancy} />
                    )
                  }
                </ul>
              </Typography>
            </CardContent>
          </Collapse>
        </Card>
      </Grid>
    </Grid>  
  );
};