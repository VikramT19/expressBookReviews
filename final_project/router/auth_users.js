const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Placeholder for validation logic
  return true; // Replace with actual validation logic
}

const authenticatedUser = (username, password) => {
  // Placeholder for authentication logic
  return true; // Replace with actual authentication logic
}

// Login endpoint
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username and password match (Replace with actual authentication logic)
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    const accessToken = jwt.sign({ username }, "replace_with_long_and_secure_secret", { expiresIn: "1h" });
    return res.status(200).json({ message: "Login successful", accessToken });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review endpoint
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  // Check if review content is provided
  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add review to the book's reviews array
  if (!books[isbn].reviews) {
    books[isbn].reviews = [];
  }
  books[isbn].reviews.push({ username: req.user.username, review });

  return res.status(200).json({ message: "Review added successfully", book: books[isbn] });
});

// Delete a book review endpoint
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;

  // Ensure user is authenticated and retrieve username from session
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing JWT token" });
  }

  jwt.verify(token, "replace_with_long_and_secure_secret", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid JWT token" });
    }

    const username = decoded.username;

    // Check if book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the book has reviews
    if (!books[isbn].reviews || books[isbn].reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this book" });
    }

    // Filter reviews for the authenticated user
    const filteredReviews = books[isbn].reviews.filter(review => review.username === username);

    // If no reviews found for the user
    if (filteredReviews.length === 0) {
      return res.status(404).json({ message: "You have no reviews for this book" });
    }

    // Remove all reviews for the authenticated user
    books[isbn].reviews = books[isbn].reviews.filter(review => review.username !== username);

    return res.status(200).json({ message: "Reviews deleted successfully", book: books[isbn] });
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
