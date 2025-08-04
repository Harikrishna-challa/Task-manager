import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function UpdateTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "pending"
  });

  // ✅ Fetch individual task on load
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`/tasks/${id}`);
        setTask(res.data.task);
      } catch (err) {
        console.error("Fetch error:", err.response?.data?.message || err.message);
        alert("Error fetching task.");
        navigate("/dashboard");
      }
    };

    fetchTask();
  }, [id, navigate]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/tasks/${id}`, task);
      alert("Task updated!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Update error:", err.response?.data?.message || err.message);
      alert("Update failed.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Edit Task</h2>
        <form onSubmit={handleUpdate}>
          <input
            name="title"
            value={task.title}
            onChange={handleChange}
            className="form-control mb-2"
            placeholder="Task Title"
            required
          />
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="form-control mb-2"
            placeholder="Task Description"
            required
          />
          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            className="form-control mb-2"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In‑Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button className="btn btn-primary">Update</button>
        </form>
      </div>
    </>
  );
}

export default UpdateTask;
