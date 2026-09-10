import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function AuthorDashboard() {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    const res = await api.get("/books/my-books");
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    await api.delete(`/books/${id}`);
    fetchBooks();
  };

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>My Books</h2>
        <Link className="btn" to="/add-book">+ Add Book</Link>
      </div>

      {books.length === 0 ? (
        <p>You haven't added any books yet.</p>
      ) : (
        <table className="card">
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.genre || "—"}</td>
                <td>⭐ {b.average_rating || 0}</td>
                <td style={{ display: "flex", gap: 8 }}>
                  <Link className="btn secondary" to={`/books/${b.id}`}>View</Link>
                  <Link className="btn secondary" to={`/edit-book/${b.id}`}>Edit</Link>
                  <button className="btn danger" onClick={() => handleDelete(b.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
