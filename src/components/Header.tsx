import React from 'react';
import { useState, useEffect } from 'react';

import {  FiMoon, FiSun } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Header:React.FC=()=>{
  const navigate=useNavigate();

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
      document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    const handleSignOut = () => {
      localStorage.removeItem('authToken');

      navigate('/login');
      };


 return(<>
 
 <div className="w-full flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-purple-600 rounded-full animate-spin"></div>
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={() => setDarkMode(!darkMode)} className="text-purple-600 hover:text-purple-800 transition">
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          <button
            className="text-sm text-purple-600 hover:underline"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>
 </>)

}


export default Header;