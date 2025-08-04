// src/pages/CreateTask.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import Navbar from "../components/Navbar";

function CreateTask() {
  const navigate = useNavigate();

  // Form fields
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "pending",
    assignedTo: "", // must choose a user
  });

  // List of users to assign tasks to
  const [users, setUsers] = useState([]);

  // Fetch all users on mount so we can populate the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users"); // ← you need a GET /api/users route
        setUsers(res.data.users);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit the form
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      // POST to /api/tasks/create with our full payload
      await axios.post("/tasks/create", formData);
      alert("Task created successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error("CreateTask error:", err.response || err);
      alert(
        err.response?.data?.message ||
          "Task creation failed. Please fill all fields."
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Create Task</h2>
        <form onSubmit={handleCreate}>
          {/* Title */}
          <input
            name="title"
            onChange={handleChange}
            placeholder="Title"
            className="form-control mb-2"
            required
          />

          {/* Description */}
          <input
            name="description"
            onChange={handleChange}
            placeholder="Description"
            className="form-control mb-2"
          />

          {/* Due Date */}
          <input
            name="dueDate"
            type="date"
            onChange={handleChange}
            className="form-control mb-2"
          />

          {/* Priority */}
          <select
            name="priority"
            onChange={handleChange}
            className="form-control mb-2"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {/* Status */}
          <select
            name="status"
            onChange={handleChange}
            className="form-control mb-2"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* 🔹 Assigned To */}
          <select
            name="assignedTo"
            onChange={handleChange}
            className="form-control mb-2"
            required
          >
            <option value="">-- Assign To --</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>

          {/* Submit */}
          <button type="submit" className="btn btn-success">
            Create Task
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateTask;
// This code defines a CreateTask component that allows users to create new tasks.
// It fetches a list of users to assign tasks to, handles form input changes, and