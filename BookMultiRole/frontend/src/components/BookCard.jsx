import React from "react";
import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  return (
    <div className="card">
      {book.cover_url && (
        <img
          src={book.cover_url}
          alt={book.title}
          style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 6, marginBottom: 10 }}
        />
      )}
      <h3 style={{ margin: "0 0 6px" }}>{book.title}</h3>
      <p style={{ margin: "0 0 6px", color: "#555", fontSize: "0.9rem" }}>
        by {book.author_name || "Unknown"} {book.genre && `· ${book.genre}`}
      </p>
      <p style={{ margin: "0 0 10px", fontSize: "0.9rem" }}>
        ⭐ {book.average_rating || 0} / 5
      </p>
      <Link className="btn" to={`/books/${book.id}`}>View Details</Link>
    </div>
  );
}
