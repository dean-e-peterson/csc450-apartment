import React from "react";
import Building from "../layout/Building";

export default function Homepage() {
  return (
    [1,2].map(buildingNumber =>
      <Building key={buildingNumber} buildingNumber={buildingNumber} />
    )
  );
}
