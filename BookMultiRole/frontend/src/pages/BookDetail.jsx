import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function BookDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const fetchBook = async () => {
    const res = await api.get(`/books/${id}`);
    setBook(res.data);
  };

  useEffect(() => {
    fetchBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post(`/books/${id}/reviews`, { rating: Number(rating), comment });
      setComment("");
      fetchBook();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not submit review");
    }
  };

  const canManage =
    user && book && (user.role === "admin" || user.id === book.author_id);

  const handleDelete = async () => {
    if (!window.confirm("Delete this book?")) return;
    await api.delete(`/books/${id}`);
    navigate("/my-books");
  };

  if (!book) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="card">
        <h2>{book.title}</h2>
        <p style={{ color: "#555" }}>
          by {book.author_name} {book.genre && `· ${book.genre}`}{" "}
          {book.published_year && `· ${book.published_year}`}
        </p>
        <p>⭐ {book.average_rating || 0} / 5</p>
        <p>{book.description}</p>

        {canManage && (
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button className="btn secondary" onClick={() => navigate(`/edit-book/${book.id}`)}>
              Edit
            </button>
            <button className="btn danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>

      {user && (
        <div className="card">
          <h3>Leave a Review</h3>
          {error && <p className="error-text">{error}</p>}
          <form onSubmit={handleReview}>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
            <button className="btn" type="submit">Submit Review</button>
          </form>
        </div>
      )}

      <div className="card">
        <h3>Reviews ({book.reviews.length})</h3>
        {book.reviews.length === 0 && <p>No reviews yet.</p>}
        {book.reviews.map((r) => (
          <div key={r.id} style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
            <strong>{r.user_name}</strong> — ⭐ {r.rating}
            <p style={{ margin: "4px 0 0" }}>{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
