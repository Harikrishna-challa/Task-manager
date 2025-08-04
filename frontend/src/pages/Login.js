import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axiosInstance";
import AOS from "aos";

function Login() {
  const navigate = useNavigate(); // To navigate programmatically after successful login
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800 }); // Animation setup
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    setError(""); // Clear previous errors
    try {
      // Sending POST request to login
      const response = await axios.post("/auth/login", formData, {
        withCredentials: true, // To handle cookie-based sessions (if needed)
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Store token in localStorage (or sessionStorage)
        navigate("/dashboard"); // Redirect to Dashboard on successful login
      }
    } catch (error) {
      // Handle any errors during login
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(135deg, #f0f4ff, #ffffff)" }}
    >
      <div className="card p-4 shadow rounded-4" style={{ minWidth: "350px" }} data-aos="fade-up">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">
            <i className="bi bi-box-arrow-in-right me-2 text-primary"></i>
            Login
          </h3>
          <Link to="/register" className="btn btn-outline-primary btn-sm">
            Sign Up
          </Link>
        </div>

        <form onSubmit={handleLogin}>
          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="Email"
            className="form-control mb-3"
            required
          />

          <div className="input-group mb-3">
            <input
              name="password"
              type={showPassword ? "text" : "password"} // Toggle password type
              onChange={handleChange}
              placeholder="Password"
              className="form-control"
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={togglePasswordVisibility}
              tabIndex={-1} // Prevent button from being focused
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
            </button>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        {error && (
          <div className="alert alert-danger mt-3 mb-0 text-center py-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
