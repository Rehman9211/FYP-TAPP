import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Login.css"; // <-- IMPORT PURE CSS

const Lock = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const Loader2 = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="loader-spin"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const DUMMY_USERNAME = "user@lux.com";
  const DUMMY_PASSWORD = "password123";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (username === DUMMY_USERNAME && password === DUMMY_PASSWORD)
        onLogin(true);
      else
        setError(
          "Authentication Failed. Please use the demo credentials below."
        );
    }, 1500);
  };

  return (
    <div className="login-page">

      {/* Luxury glowing background bubbles */}
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="login-card"
      >
        <div className="login-header">
          <Lock className="lock-icon" />

          <h1 className="title">ACCESS</h1>
          <p className="subtitle">Universal Translator Suite</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label className="input-label">Username / Email</label>
            <input
              type="email"
              placeholder="user@lux.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="lux-input"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="input-label">Password</label>
            <input
              type="password"
              placeholder="password123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="lux-input"
              required
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-box">{error}</div>}

          <motion.button
            whileHover={!isLoading ? { scale: 1.03 } : {}}
            whileTap={!isLoading ? { scale: 0.97 } : {}}
            type="submit"
            disabled={isLoading}
            className="login-btn"
          >
            {isLoading ? (
              <>
                <Loader2 />
                <span>Authenticating...</span>
              </>
            ) : (
              "Initiate Login"
            )}
          </motion.button>
        </form>

        {/* <div className="demo-box">
          <p>
            <span className="demo-title">Demo Credentials</span>
            <br />
            User: <span className="demo-value">user@lux.com</span>
            <br />
            Pass: <span className="demo-value">password123</span>
          </p>
        </div> */}
      </motion.div>
    </div>
  );
}
