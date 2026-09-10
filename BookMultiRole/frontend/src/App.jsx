import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import BookList from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import BookForm from "./pages/BookForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthorDashboard from "./pages/AuthorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/my-books"
          element={
            <PrivateRoute roles={["author", "admin"]}>
              <AuthorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-book"
          element={
            <PrivateRoute roles={["author", "admin"]}>
              <BookForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-book/:id"
          element={
            <PrivateRoute roles={["author", "admin"]}>
              <BookForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
