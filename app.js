//jshint esversion:6
require('dotenv').config()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const port = 3000;


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect('mongodb://127.0.0.1:27017/userDB');
// const encKey = process.env.SOME_32BYTE_BASE64_STRING;// + to pass and hash
// const sigKey = process.env.SOME_64BYTE_BASE64_STRING;// + to id and hash key
const userSchema = new mongoose.Schema({
    user: String,
    password: String
})

const User = new mongoose.model("User",userSchema);




app.get("/",(req, res)=>{
    res.render("home")
})

app.get("/login",(req, res)=>{
    res.render("login")
})

app.get("/register",(req, res)=>{
    res.render("register")
})

app.post("/register",(req, res)=>{
    const user = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password,saltRounds, (err,hash)=>{
        const account = new User({user : user, password : hash});
        account.save().then(() => res.render("secrets")).catch((err) => console.log(err));
    })
})

app.post("/login",(req, res)=>{
    const user = req.body.username;
    const password = req.body.password;
    User.findOne({user : user})
    .then((found) =>{
        bcrypt.compare(password, found.password)
        .then((result) =>{
            if(result){
                res.render("secrets");
            }else{
                console.log("wrong password");
            }
        });
            
    })
    .catch((err) => console.log(err)); 
})



app.listen(port, ()=> console.log("listening on port " + port));