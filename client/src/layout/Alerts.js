import React from "react";

const myStr = "Hello, this is in <strong>bold</strong>";

export default function Alerts() {
  return (
    <div dangerouslySetInnerHTML={{__html: myStr}}></div>
  )
};