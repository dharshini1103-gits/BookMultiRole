import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">📚 BookMultiRole</Link>
      <div className="nav-links">
        <Link to="/">Browse</Link>
        {user && user.role === "admin" && <Link to="/admin">Admin</Link>}
        {user && (user.role === "author" || user.role === "admin") && (
          <Link to="/my-books">My Books</Link>
        )}
        {user ? (
          <>
            <span className="badge">{user.role}</span>
            <span>{user.full_name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
