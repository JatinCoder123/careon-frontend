import axios from "axios";
import { USER_API_URL } from "../../assets/assets";
// import { USER_API_URL } from "../../app.config.js";
export const googleLogin = async (idToken) => {
  try {
    const { data } = await axios.post(
      `${USER_API_URL}/login/google`,
      { idToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log("Google login response:", data);
    return data;
  } catch (error) {
    console.log("Google login error:", error);
  }
};
export const verifyToken = async (token) => {
  try {
    const { data } = await axios.get(`${USER_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    console.error(
      "Token verification error:",  
      error.response?.data || error.message,
    );
    throw error;
  }
};
