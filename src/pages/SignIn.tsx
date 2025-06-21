
import React, { useState } from "react";

import AuthForm from "../components/AuthForm/AuthForm";
import { useNavigate } from "react-router-dom";
import { Notification } from "../util/Notification";
import axios from "axios";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


const SignIn = () => {
  const navigate = useNavigate();
  
  const [loading,setLoading]=useState(false);


  const fields = [
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
    
  ];

  const handleSignIn = async(data: Record<string, string>) => {
    const { email, password } = data;

    if (!email || !password) {
      return Notification("All fields are required", "error");
    }
  
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiBaseUrl}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      
  
      if (response.data.success && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        Notification("Login successful", "success");
        navigate("/"); 

        setLoading(false);
      } else {
        setLoading(false);
        Notification(response.data.message || "Login failed", "error");
      }
    } catch (err: any) {

      const errors = err?.response?.data?.errors;

      if (Array.isArray(errors)) {
        errors.forEach((e: any) => {
          Notification(e.msg, "error");
        });
      } else {
        const fallbackMessage = err?.response?.data?.message || "Something went wrong";
        Notification(fallbackMessage, "error");
      }
    
      setLoading(false);
    }
 
  };

  return (<>
  
<AuthForm
  title="Sign in"
  fields={fields}
  buttonText="Sign up"
  onSubmit={handleSignIn}
  loading={loading}
  bottomText={
    <p >
      Create a new account ?{" "}
      <span onClick={()=>{
        navigate("/register")
      }} className="text-indigo-600 hover:underline cursor-pointer">
      Sign Up
      </span>
        
     
    </p>
  }
/>
  </>
    
  );
};

export default SignIn;