import React, { useState } from 'react';
import {
  Drawer as MUIDrawer,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  drawer: {
    width: '190px',
  },
});

export default function Drawer() {
  const classes = useStyles();
  const history = useHistory();
  const [anchor, setAnchor] = useState(null);
  const itemsList = [
    {
      text: 'Home',
      icon: <InboxIcon />,
      onClick: () => history.push('/'),
    },
    {
      text: 'About',
      icon: <MailIcon />,
      onClick: () => history.push('/about'),
    },
    {
      text: 'Contact',
      icon: <MailIcon />,
      onClick: () => history.push('/contact'),
    },
  ];

  const handleClick = (e) => {
    setAnchor(e.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  return (
    <MUIDrawer variant='permanent' className={classes.drawer}>
      <List>
        {itemsList.map((item, index) => {
          const { text, icon, onClick } = item;
          return (
            <ListItem button key={text} onClick={onClick}>
              {icon && <ListItemIcon>{icon}</ListItemIcon>}
              <ListItemText primary={text} />
            </ListItem>
          );
        })}
      </List>
    </MUIDrawer>
  );
}
