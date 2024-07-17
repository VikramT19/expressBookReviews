const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Check if username or password is missing
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if username already exists
    if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
    }
  
    // Register the new user
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered" });
  });

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.status(200).send(JSON.stringify(books, null, 2));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  const book = books[isbn]; // Look up the book in the books object
  if (book) {
    res.status(200).send(JSON.stringify(book, null, 2)); // Send the book details as a JSON response
  } else {
    res.status(404).json({ message: "Book not found" }); // Send an error message if the book is not found
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; // Retrieve the author from the request parameters
    const bookList = [];
  
    for (let isbn in books) { // Iterate through the books object
      if (books[isbn].author === author) { // Check if the author matches
        bookList.push(books[isbn]); // Add the book to the bookList array if the author matches
      }
    }
  
    if (bookList.length > 0) {
      res.status(200).send(JSON.stringify(bookList, null, 2)); // Send the list of books as a JSON response
    } else {
      res.status(404).json({ message: "Books by this author not found" }); // Send an error message if no books are found
    }
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title; // Retrieve the title from the request parameters
    const bookList = [];
  
    for (let isbn in books) { // Iterate through the books object
      if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) { // Check if the title matches (case insensitive)
        bookList.push(books[isbn]); // Add the book to the bookList array if the title matches
      }
    }
  
    if (bookList.length > 0) {
      res.status(200).send(JSON.stringify(bookList, null, 2)); // Send the list of books as a JSON response
    } else {
      res.status(404).json({ message: "Books with this title not found" }); // Send an error message if no books are found
    }
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
    const book = books[isbn]; // Find the book in the books object
    if (book && book.reviews && book.reviews.length > 0) {
      res.status(200).send(JSON.stringify(book.reviews, null, 2)); // Send the reviews as a JSON response
    } else {
      res.status(404).json({ message: "No reviews found for this book" }); // Send an error message if no reviews are found
    }
  });

module.exports.general = public_users;
