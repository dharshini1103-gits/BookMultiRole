import React, { useEffect, useState } from "react";
import api from "../api/axios";
import BookCard from "../components/BookCard";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBooks = async (query = "") => {
    setLoading(true);
    try {
      const res = await api.get("/books/", { params: query ? { search: query } : {} });
      setBooks(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(search);
  };

  return (
    <div className="container">
      <h2>Browse Books</h2>
      <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 0 }}
        />
        <button className="btn" type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div className="grid">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
