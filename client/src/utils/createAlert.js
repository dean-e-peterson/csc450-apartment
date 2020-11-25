import axios from "axios";

export default async function createAlert(authUser, toUser, text, link) {
  const body = {
    user: toUser,
    text: text,
    link: link,
  }
  await axios.post(
    "/api/alerts",
    body,
    { headers: { "x-auth-token": authUser.token, "Content-type": "application/json" }}
  )
}