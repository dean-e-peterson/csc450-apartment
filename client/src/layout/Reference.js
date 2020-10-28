import React from "react";
import {
  Card,
  CardContent,
  TextField,
} from "@material-ui/core";

export default function reference({ reference }) {
  return (
    <Card>
      <CardContent>
        <TextField
          id="name"
          label="Name"
          name="name"
          placeholder="Name"
          value={reference.name}
        />
        <TextField
          id="email"
          label="Email"
          name="email"
          placeholder="Email"
          value={reference.email}
        />
        <TextField
          id="phone"
          label="Phone"
          name="phone"
          placeholder="Phone"
          value={reference.phone}
        />
      </CardContent>
    </Card>
  );
};