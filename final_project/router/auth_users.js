const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();




let users = []; 

const isValid = (username)=>{ 
    
    return (username && username.length > 0);
}

const authenticatedUser = (username,password)=>{ 
    
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}


regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in: Please provide username and password"});
    }

    if (authenticatedUser(username, password)) {
        
        let accessToken = jwt.sign({
            data: password 
                           
        }, 'access', { expiresIn: 60 * 60 }); 

        
        req.session.authorization = {
            accessToken: accessToken,
            username: username
        }
        return res.status(200).send("User successfully logged in");

    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});


regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review; 
    
    
    
    const username = req.session.authorization.username; 

    if (!books[isbn]) {
        return res.status(404).json({message: `Book with ISBN ${isbn} not found.`});
    }
    
    if (!review) {
        return res.status(400).json({message: "Review content cannot be empty. Please provide a review in the query string."});
    }

    
    books[isbn].reviews[username] = review;

    
    const action = books[isbn].reviews[username] ? "modified" : "added";
    
    return res.status(200).json({message: `Review successfully ${action}/added for ISBN ${isbn} by user ${username}.`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;