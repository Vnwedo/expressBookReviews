const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const getBooksPromise = () => {
    return new Promise((resolve, reject) => {
        
        
        resolve(books); 
    });
};

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login."});
    } else {
      
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  
  return res.status(404).json({message: "Unable to register user. Please provide username and password."});
});



public_users.get('/',function (req, res) {
  
  getBooksPromise()
    .then((bookList) => {
      return res.status(200).send(JSON.stringify(bookList, null, 4));
    })
    .catch((error) => {
      return res.status(500).json({message: "Error fetching books."});
    });
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

 const author = req.params.author; 
 let matchingBooks = {};
 
 const bookKeys = Object.keys(books);

 for (const isbn of bookKeys) {
   if (books[isbn].author === author) {
     matchingBooks[isbn] = books[isbn];
   }
 }

 if (Object.keys(matchingBooks).length > 0) {
   return res.status(200).json(matchingBooks);
 } else {
   return res.status(404).json({message: `No books found by author: ${author}.`});
 }
});


public_users.get('/title/:title',function (req, res) {

 const title = req.params.title;
 let matchingBooks = {};
 
 const bookKeys = Object.keys(books);

 for (const isbn of bookKeys) {
   if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) { 
     matchingBooks[isbn] = books[isbn];
   }
 }

 if (Object.keys(matchingBooks).length > 0) {
   return res.status(200).json(matchingBooks);
 } else {
   return res.status(404).json({message: `No books found with title containing: ${title}.`});
 }
});


public_users.get('/review/:isbn',function (req, res) {

 const isbn = req.params.isbn; 
 if (books[isbn]) {
   return res.status(200).json(books[isbn].reviews);
 } else {
   return res.status(404).json({message: `Book with ISBN ${isbn} not found.`});
 }
});

module.exports.general = public_users;