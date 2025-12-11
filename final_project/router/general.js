const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
  return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
      return res.status(200).json(books[isbn]);
  } else {
      return res.status(404).json({message: `Book with ISBN ${isbn} not found.`});
  }
});
  

public_users.get('/author/:author',function (req, res) {
  
  return res.status(300).json({message: "Yet to be implemented"});
});


public_users.get('/title/:title',function (req, res) {
  
  return res.status(300).json({message: "Yet to be implemented"});
});


public_users.get('/review/:isbn',function (req, res) {
  
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;