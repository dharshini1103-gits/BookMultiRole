import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/");
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (id, role) => {
    await api.patch(`/users/${id}/role`, { role });
    fetchUsers();
  };

  const toggleActive = async (u) => {
    const endpoint = u.is_active ? "deactivate" : "activate";
    await api.patch(`/users/${u.id}/${endpoint}`);
    fetchUsers();
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <p>Manage all registered users and their roles.</p>
      {error && <p className="error-text">{error}</p>}

      <table className="card">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.full_name}</td>
              <td>{u.email}</td>
              <td>
                <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)}>
                  <option value="user">User</option>
                  <option value="author">Author</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>{u.is_active ? "Active" : "Deactivated"}</td>
              <td>
                <button
                  className={`btn ${u.is_active ? "danger" : "secondary"}`}
                  onClick={() => toggleActive(u)}
                >
                  {u.is_active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
