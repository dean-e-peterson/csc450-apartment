import React from "react";
import {
  Card,
  CardContent,
  TextField,
} from "@material-ui/core";

export default function reference({ reference, setApplication }) {
  const onChange = (e) => {
    e.persist();
    setApplication(application => {
      const thisReference = application.references.find(ref => ref._id === reference._id);
      thisReference[ e.target.name ] = e.target.value;
      return { ...application };
    });
  }

  return (
    <Card>
      <CardContent>
        <TextField
          id="name"
          label="Name"
          name="name"
          onChange={onChange}
          placeholder="Name"
          value={reference.name}
        />
        <TextField
          id="email"
          label="Email"
          name="email"
          onChange={onChange}
          placeholder="Email"
          value={reference.email}
        />
        <TextField
          id="phone"
          label="Phone"
          name="phone"
          onChange={onChange}
          placeholder="Phone"
          value={reference.phone}
        />
        <TextField
          id="relation"
          label="Relationship"
          name="relation"
          onChange={onChange}
          placeholder="Relationship"
          value={reference.relation}
        />        
      </CardContent>
    </Card>
  );
};