import React, { useState } from "react";

import { Eye, EyeOff } from 'lucide-react';

interface AuthInputProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  return (
    <div className="relative w-full mb-6">
    <input
      id={name}
      name={name}
      type={isPassword && showPassword ? 'text' : type}
      value={value}
      onChange={onChange}
      placeholder=" "
      required={required}
      className="peer w-full border  border-indigo-400 text-gray-900 placeholder-transparent rounded-md px-3 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    />
    <label
      htmlFor={name}
      className={`absolute left-3 bg-white  text-sm text-indigo-600 transition-all duration-200 
        peer-placeholder-shown:top-4 
        peer-placeholder-shown:text-base 
        peer-placeholder-shown:text-gray-400 
        peer-focus:-top-[10px]
        peer-focus:text-sm 
        peer-focus:text-indigo-600
        ${
          value ? "-top-[10px] text-sm text-indigo-600" : ""
        }`}
    >
      {label}
    </label>

    {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
  </div>
  
  );
};

export default AuthInput;
