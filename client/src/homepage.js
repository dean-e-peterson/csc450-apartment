import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import LocationFilteredList from "./LocationFilteredList";
import * as api from "../../service/api";
import { GridContainer, GridItem } from "canvas-ui-react";
import ReprocessTrans from "./ReprocessTrans";
import { bool } from "prop-types";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Icon,
  IconButton,
  Typography,
  Button
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import ReactDOM from "react-dom";
import LocationPageStyle from "./LocationPageStyle.css";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import { Grid } from "canvas-ui-react";
import { Apartment } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    minWidth: 1200
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  return (
    <Grid.Container>
      <Grid.Item>
        <AppBar position='static'>
          <Toolbar>
            <Button color='inherit'>Logout</Button>
            <Typography
              style={{ textAlign: "Center" }}
              variant='h6'
              className={classes.title}
            >
              Apartments
            </Typography>
            <Button color='inherit'>Login</Button>
            <Button color='inherit'>Register</Button>
            <Button color='inherit'>Chat</Button>
          </Toolbar>
        </AppBar>
        <Paper className={classes.root}></Paper>
      </Grid.Item>

      <Grid.Item>
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              component='img'
              alt='Apartment 1'
              height='140'
              Expand
              snippet
              title='Apartment 1'
            />

            <CardContent>
              <Typography variant='h5' component='h2'>
                Apartment 1
              </Typography>
              <Typography variant='body2' color='textSecondary' component='p'>
                Beautiful 1, 2 and 3 bedroom apartments - full of amenties!
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
            </Button>
            <ArrowDropDownIcon />
            <Button style={{ textAlign: "right" }} size='small' color='primary'>
              Contact Us
            </Button>
          </CardActions>
        </Card>
      </Grid.Item>
      <GridItem>
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              component='img'
              alt='Apartment 2'
              height='140'
              Link
              to='https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400&family=Raleway&display=swap'
              title='Apartment 2'
            />
            <CardContent>
              <Typography gutterBottom variant='h5' component='h2'>
                Apartment 2
              </Typography>
              <Typography variant='body2' color='textSecondary' component='p'>
                Beautiful 1, 2 and 3 bedroom apartments - full of amenties!
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size='small' color='primary'>
              Apply
            </Button>
            <Button size='small' color='primary'>
              Vacancies
            </Button>
            <ArrowDropDownIcon />
            <Button
              style={{ alignSelf: "flex-end" }}
              size='small'
              color='primary'
            >
              Contact Us
            </Button>
          </CardActions>
        </Card>
      </GridItem>
    </Grid.Container>
  );
  {
    /*<Router>*/
  }
  {
    /*/!*<Route exact path="/" component={ReprocessTrans}  data={state.integrations}></Route>*!/*/
  }
  {
    /*</Router>*/
  }
}
