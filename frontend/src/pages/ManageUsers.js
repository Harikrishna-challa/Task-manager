import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";

// Parse current user ID from JWT
function getCurrentUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch {
    return null;
  }
}

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const currentUserId = getCurrentUserId();

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users");
      console.log("Full response:", res.data);
      console.log("Fetched users:", res.data.users);
      setUsers(res.data.users);
    } catch (err) {
      console.error("Fetch users failed", err);
      toast.error("Could not load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle role
  const toggleRole = async (userId, newRole) => {
    try {
      await axios.put(`/users/${userId}/role`, { role: newRole });
      toast.success(`Set ${newRole} role`);
      fetchUsers();
    } catch (err) {
      console.error("Update role failed", err);
      toast.error("Role update failed");
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`/users/${userId}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      console.error("Delete user failed", err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Users</h2>

      <ul className="list-group">
        {users.map((user) => {
          console.log("Current user ID:", currentUserId);
          console.log("This user:", user._id, user.role);

          return (
            <li
              key={user._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{user.name}</strong> ({user.email}){" "}
                <span className="badge bg-secondary">{user.role}</span>
              </div>
              <div>
                {/* Promote if not admin */}
                {user.role === "user" && (
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={() => toggleRole(user._id, "admin")}
                  >
                    Promote to Admin
                  </button>
                )}

                {/* Demote if admin, but not yourself */}
                {user.role === "admin" && user._id !== currentUserId && (
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => toggleRole(user._id, "user")}
                  >
                    Demote to User
                  </button>
                )}

                {/* Delete if not yourself */}
                {user._id !== currentUserId && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
