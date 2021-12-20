//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const md5 = require("md5");
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const encrypt = require("mongoose-encryption");
require('mongoose-type-email');

const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB",{useUnifiedTopology:true,useNewUrlParser:true,useCreateIndex:true});


const userSchema = new mongoose.Schema ({
    email:String,
    password:String
});

userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/logout",(req,res)=>{
    res.redirect("/");
});

app.get("/submit",(req,res)=>{
    res.render("submit");
});

app.get("/secrets",(req,res)=>{
    if (req.isAuthenticated()){
        res.render("secrets");
    } else {
        res.redirect("/login");
    }
});

app.post("/submit",(req,res)=>{
    res.send(req.body.secret);
});


app.post("/register",(req,res)=>{
    // bcrypt.hash(req.body.password, saltRounds, (err, hash)=>{
    //     const newUser = new User ({
    //         email: req.body.username,
    //         password: hash
    //     });
    //     newUser.save((err)=>{
    //         if (err){
    //             console.log(err);
    //         } else {
    //             res.render("secrets");
    //         }
    //     })
    // });

    User.register({username:req.body.username, active: false}, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })
});


app.post("/login",(req,res)=>{
    User.find({email:req.body.username},(err,foundUser)=>{
        if (err) {
            console.log(err);
        } else {
            if (!foundUser){
                res.send("User does not exist!");
            }
            bcrypt.compare(req.body.password, foundUser[0].password, function(err, result) {
                if (result) {
                    res.render("secrets");
                }
                else {
                res.send("Incorrect password!");
                }
            });
        }
    })
});





port = process.env.PORT;
if (port == "" || port == null){
    port = 3000;
};

app.listen(port,()=>{
    console.log("Server started on port",port);
});