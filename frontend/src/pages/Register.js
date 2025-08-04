import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import AOS from "aos";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("/auth/register", formData);
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(135deg, #f0f4ff, #ffffff)" }}
    >
      <div className="card p-4 shadow rounded-4" style={{ minWidth: "350px" }} data-aos="zoom-in">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">
            <i className="bi bi-person-plus-fill me-2 text-success"></i>
            Register
          </h3>
          <Link to="/login" className="btn btn-outline-success btn-sm">
            Login
          </Link>
        </div>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="form-control mb-3"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-control mb-3"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control mb-3"
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn btn-success w-100">
            Register
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

export default Register;
