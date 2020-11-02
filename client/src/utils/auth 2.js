import axios from "axios";

// Validate a JsonWebToken against the server.
// Returns the logged in user object or null.
export const checkAuthToken = async (token) => {
  try {
    const response = await axios.get(
      "api/auth",
      { headers: { "x-auth-token": token }}
    );
    const user = response.data;
    // Store the token with the user even though it is not in DB.
    user.token = token;
    return user;
  } catch (err) {
    return null;
  }
}