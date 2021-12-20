//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const e = require("express");   
const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

let ToDos = ["Buy Food","Cook Food","Eat Food"];
let workItems = [];

port = process.env.PORT;
if (port == "" || port == null) {
    port = 3000;
}

let today = new Date();
let options = {weekday:"long",month:"long",day:"numeric"};
let day = today.toLocaleDateString("en-US",options);

app.post("/",(req,res)=>{
    if (req.body.toDo!="") {
        if (req.body.button=="Work"){
            workItems.push(req.body.toDo);
            res.redirect("/work");
        } else {
            ToDos.push(req.body.toDo);
            res.redirect("/");
        }
    }
});

app.get("/",(req,res)=>{
    res.render("list",{listTitle: day, toDoExtra: ToDos});
});

app.get("/work",(req,res)=>{
    res.render("list",{listTitle: "Work List", toDoExtra: workItems});
});

app.get("/about",(req,res)=>{
    res.render("about");
});

app.listen(3000,()=>{
    console.log("Server started on port",port,".");
});