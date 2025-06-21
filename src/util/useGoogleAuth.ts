import axios from 'axios';
import { Notification } from "./Notification";
import { useNavigate } from 'react-router-dom';
import type { CredentialResponse } from '@react-oauth/google';

// type CredentialResponse = {
//   credential: string;
//   select_by?: string;
//   clientId?: string;
// };

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


const useGoogleLogin = () => {

  
  const navigate=useNavigate();
  const responseGoogle = async (response: CredentialResponse) => {

    
    const tokenId = response.credential;

    if (tokenId) {
      try {
        const res = await axios.post(
          `${apiBaseUrl}/auth/google-auth`,
          {
            idToken: tokenId,
          },
          { withCredentials: true }
        );
         

        const { token }= res.data;

        
        localStorage.setItem("authToken", token);

        Notification("Login successful!", "success");

        navigate("/");
      } catch (err) {
        Notification("login failed try again after some time", "error");
        console.error(err);
      }
    } else {
      Notification("Google login failed. Please try again.", "error");
    }
  };

  const resFailed = () => {
    Notification("Google login was cancelled or failed", "error");
  };

  return {
    responseGoogle,
    resFailed,
  };
};

export default useGoogleLogin;
