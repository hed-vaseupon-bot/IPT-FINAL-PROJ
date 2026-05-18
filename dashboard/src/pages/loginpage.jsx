import React, { useState } from "react";
import "./login.css";

function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:1337/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.user.id);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
        }),
      );

      window.location.href = "/admin";
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        "Unable to reach the server. Please check if your backend is running.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Exit / Close Button */}
        <a href="/" className="login-exit-button" aria-label="Close login screen">
          &times;
        </a>

        <h1 className="login-title">Sign in</h1>
        <p className="login-subtitle">Welcome back! Please sign in to your account.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              autoComplete="email"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              className="checkbox-input"
            />
            <label className="checkbox-label" htmlFor="remember">
              Remember me
            </label>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;