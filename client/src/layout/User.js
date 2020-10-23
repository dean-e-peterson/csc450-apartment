import React from "react";
import {
  Card,
  CardContent
} from "@material-ui/core";

export default function User({ user, setUsers, authUser }) {
  return (
    <Card>
      <CardContent>
        {user.firstName + " " + user.lastName}
      </CardContent>
    </Card>
  );
};