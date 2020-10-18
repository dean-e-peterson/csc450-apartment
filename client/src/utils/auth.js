import axios from "axios";

// Validate a JsonWebToken against the server.
// Returns the logged in user object or null.
export const checkAuthToken = async (token) => {
  try {
    const response = await axios.get(
      "api/auth",
      { headers: { "x-auth-token": token }}
    );
    return response.data;
  } catch (err) {
    return null;
  }
}