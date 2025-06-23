

import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm/AuthForm";
import { useState } from "react";
import axios from "axios";
import { Notification } from "../util/Notification";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


const SignUp=()=>{
  
  const navigate = useNavigate();
  const [step, setStep] = useState<"basic" | "otp">("basic");
  const [formData, setFormData] = useState<{ name?: string; email?: string }>({});
 const [loading,setLoading]=useState(false);
  const fields =
    step === "basic"
      ? [
          { name: "name", label: "Name", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "password", label: "Password", type: "password" },
        ]
      : [
          { name: "otp", label: "OTP", type: "text" },
        ];

  const handleSubmit = async (data: Record<string, string>) => {
    if (step === "basic") {

      if(!data.name || !data.email || !data.password){
        return Notification("All fields are required","error");
      }
     
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return Notification("Please enter a valid email address", "error");
      }
    
     
      if (data.password.length < 6) {
        return Notification("Password must be at least 6 characters long", "error");
      }
    
      setLoading(true)
      setFormData(data); 
      try {
        const response=await axios.post(`${apiBaseUrl}/auth/register`, {
          name: data.name,
          email: data.email,
          password:data.password
        },{
          withCredentials: true
        });
        if(response.data.success){

          
           Notification(response.data.message,"success");
           setStep("otp");
         setLoading(false)
         return ;

        }

       return Notification(response.data.message,"error")
          
         

      } catch (err:any) {
        const errorMessage = err?.response?.data?.message || "Something went wrong";
        Notification(errorMessage,"error");

        setLoading(false)
      }
    } else {
      if(!formData.email || !data.otp ){
        return Notification("All fields are required","error");

      }

      if(data.otp.length !== 6){
        return Notification("Invalid Otp","error");

      }
      setLoading(true);
      try {
        const response= await axios.post(`${apiBaseUrl}/auth/verify-otp`, {
          email: formData.email,
          otp: data.otp,
        },{
          withCredentials: true
        });
        

        if (response.data.success && response.data.token) {
          localStorage.setItem("authToken", response.data.token);
    
          Notification(response.data.message, "success");
          setLoading(false);

          navigate("/");
        } else {
          setLoading(false);
          Notification(response.data.message, "error");
        }


      

      } catch (err:any) {

        Notification(err.data.message || "Interval server error ", "error");
        setLoading(false);
      }
    }
  };

  return (
    <AuthForm
      title="Sign up"
      fields={fields}
      buttonText={step === "basic" ? "Send OTP" : "Verify OTP"}
      onSubmit={handleSubmit}
      loading={loading}
     
      bottomText={
        <p>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      }
    />
  );
}

export default SignUp;