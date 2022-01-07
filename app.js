
require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const port = 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("user", userSchema);



app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    User.findOne({email: req.body.username}, (err, foundUser) => {
        bcrypt.compare(req.body.password, foundUser.password, (error, result) => {
            if(result){
                res.render("secrets");
            } else {
                console.log(error);
            }
        });        
    })
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });

        newUser.save((err) => {
            if(err){
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    })    
});

app.get("/submit", (req, res) => {
    res.render("submit");
});

app.listen(port, () => {
    console.log("Servidor iniciado na porta " + port);
})
