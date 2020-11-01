import React, { useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";

// Note: The application-wide editing reference count is a count
// instead of a boolean value because some pages, like Users,
// allow editing more than one thing at a time.  This is global to
// allow for a global beforeUnload() handler to be set on the window once.
let editingReferenceCount = 0;

const editingLeaveMessage = "The page you are editing may have unsaved changes. Do you wish to leave anyway?";

const beforeUnload = (e) => {
  console.log(editingReferenceCount);
  if (editingReferenceCount > 0) {
    e.preventDefault();
    return editingLeaveMessage; // For non-standard browsers.
  }
}

// Register listeners to warn if user changes page when editing.
window.addEventListener("beforeunload", beforeUnload);

export function setAppEditing(editing) {
  if (editing === true) {
    editingReferenceCount += 1;
  } else if (editing === false) {
    editingReferenceCount -= 1;
  } else {
    editingReferenceCount = editing; // Allow directly resetting reference count.
  }
}

export function getAppEditing() {
  return editingReferenceCount;
}

export default function EditingHandler() {
  const history = useHistory();

  useEffect(() => {
    history.block(() => {
      if (editingReferenceCount > 0) {
        return editingLeaveMessage;
      }
    });

    history.listen(() => {
      // We changed pages, so always reset editing count to 0.
      editingReferenceCount = 0;
    });
  }, []); // [] means don't run on every render.

  return (
    <Fragment></Fragment>
  )
};