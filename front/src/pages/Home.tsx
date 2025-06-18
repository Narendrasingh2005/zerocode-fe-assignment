import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const response = await axios.post("http://localhost:4000/signup", {
        name,
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/chat");
    } catch (error) {
      console.error(error);
      console.log(error);
    }
  };

  const handleSignIn = async () => {
    try {
      const response = await axios.post("http://localhost:4000/signin", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/chat");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className=" pt-52 flex-col  h-screen flex items-center
     bg-gradient-to-r from-blue-300 to-orange-200 rounded-t-3xl   bg-gradient-to-b from-slate-700 to-black"
    >
      <div className="  container mx-auto p-4 ">
        <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg p-6 ">
          <h1 className="text-2xl font-semibold mb-4 text-center">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h1>
          {isSignUp && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            type="email"
            placeholder="example@gamil.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={isSignUp ? handleSignUp : handleSignIn}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full mt-2 p-2 text-blue-500 hover:underline"
          >
            {isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
          </button>
        </div>
      </div>
      <p className="pt-20 italic font-semibold text-black">
        Please sign up or sign in to use the Chat application!
      </p>
      <p className=" italic font-semibold text-black">
        Kindly provide correct email id
      </p>
      <p className="pt-8 italic font-semibold text-black">
        {" "}
        Please wait for a moment after pressing Sign-up, as the database needs
        to initialize
      </p>
    </div>
  );
};

export default Home;
