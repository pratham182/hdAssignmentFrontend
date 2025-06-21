
import React, { useState } from "react";
import AuthInput from "./AuthInput";
import rightSideImage from "../../assets/image/image.jpg"
import { FaGoogle } from "react-icons/fa";
import googleIcon from "../../assets/image/icons8-google.svg"
import useGoogleLogin from "../../util/useGoogleAuth";
import { GoogleLogin } from "@react-oauth/google";

type Field = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
};

interface AuthFormProps {
  title: string;
  fields: Field[];
  buttonText: string;
  onSubmit: (formData: Record<string, string>) => void;
  showGoogle?: boolean;
  bottomText?: React.ReactNode;
  loading:boolean
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  fields,
  buttonText,
  onSubmit,
  showGoogle = true,
  bottomText,
  loading
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };


  const { responseGoogle, resFailed } = useGoogleLogin();
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-center md:text-left">{title}</h2>
          <p className="text-sm text-gray-500 mb-6 text-center md:text-left">
            {title} to enjoy the features of HD
          </p>

          {fields.map((field) => (
            <AuthInput
              key={field.name}
              label={field.label}
              type={field.type}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.required}
            />
          ))}

          <button
           
            type="submit"
            disabled={loading}

            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mb-4"
          >
            {
              loading?"Loading..." :buttonText
            }
          
          </button>

          {showGoogle && (
            <GoogleLogin
            onSuccess={responseGoogle}
            onError={resFailed}
            useOneTap
          />

            
            
          )}

          {bottomText && (
            <div className="mt-6 text-sm text-center">{bottomText}</div>
          )}
        </form>
      </div>

      <div className="hidden md:block md:w-1/2 h-screen">
        <img
          src={rightSideImage}
          alt="Right Illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default AuthForm;
