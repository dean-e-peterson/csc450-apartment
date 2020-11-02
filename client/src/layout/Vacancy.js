import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  vacancyListItem: {
    listStyleImage: "url(/images/bullet.svg)",
  },
}));

export default function Vacancy({ vacancy }) {
  const classes = useStyles();

  const vacancyText = 
    vacancy.bedrooms  + " bedroom" +
    (vacancy.bathrooms ? ", " + vacancy.bathrooms + " bathroom" : "") +
    " unit.  " +
    (vacancy.description ? vacancy.description: "");

  return (
    <li className={classes.vacancyListItem}>
      {vacancyText}
    </li>
  );
};