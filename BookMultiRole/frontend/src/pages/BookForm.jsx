import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function BookForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    genre: "",
    cover_url: "",
    published_year: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      api.get(`/books/${id}`).then((res) => {
        const b = res.data;
        setForm({
          title: b.title || "",
          description: b.description || "",
          genre: b.genre || "",
          cover_url: b.cover_url || "",
          published_year: b.published_year || "",
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      published_year: form.published_year ? Number(form.published_year) : null,
    };
    try {
      if (isEdit) {
        await api.put(`/books/${id}`, payload);
      } else {
        await api.post("/books/", payload);
      }
      navigate("/my-books");
    } catch (err) {
      setError(err.response?.data?.detail || "Could not save book");
    }
  };

  return (
    <div className="container">
      <form className="card" style={{ maxWidth: 500, margin: "0 auto" }} onSubmit={handleSubmit}>
        <h2>{isEdit ? "Edit Book" : "Add New Book"}</h2>
        {error && <p className="error-text">{error}</p>}
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={4}
        />
        <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} />
        <input
          name="cover_url"
          placeholder="Cover Image URL"
          value={form.cover_url}
          onChange={handleChange}
        />
        <input
          name="published_year"
          type="number"
          placeholder="Published Year"
          value={form.published_year}
          onChange={handleChange}
        />
        <button className="btn" type="submit">
          {isEdit ? "Update Book" : "Create Book"}
        </button>
      </form>
    </div>
  );
}
