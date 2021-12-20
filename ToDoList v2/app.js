//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

let connectString = process.env.CONNECTSTRING;
mongoose.connect(connectString, {useNewUrlParser: true,useUnifiedTopology: true});

const itemSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please check your data, name not found!"]
    }
});

const listSchema = new mongoose.Schema({
    name:String,
    items:[itemSchema]
});

const List = mongoose.model("List",listSchema);

const Item = mongoose.model("Item",itemSchema);

const buyfood = new Item ({
    name:"Buy Food"
});

const cookfood = new Item ({
    name:"Cook Food"
});

const eatfood = new Item ({
    name:"Eat Food"
});

const defaultItems = [buyfood,cookfood,eatfood];
// const doItems = [];
// const workItems = [];

// Item.find({},(err,res)=>{
//     if (err){
//         console.log(err);
//     } else {
//         res.forEach((i)=>{
//             doItems.push(i.name);
//         })
//     }
// });

// Workitem.find({},(err,res)=>{
//     if (err){
//         console.log(err);
//     } else {
//         res.forEach((i)=>{
//             workItems.push(i.name);
//         })
//     }
// });

port = process.env.PORT;
if (port == "" || port == null) {
    port = 3000;
};


app.get("/:listName",(req,res)=>{
    const listName = _.capitalize(req.params.listName);
    if (listName != "Favicon.ico"){
        List.findOne({name:listName},(err,foundList)=>{
            if (!err){
                if (!foundList){
                    const list = new List ({
                        name:listName,
                        items:defaultItems
                    });
                    list.save();
                    res.render("list",{listTitle:listName,toDoExtra:defaultItems});
                } else {
                    res.render("list",{listTitle:foundList.name,toDoExtra:foundList.items});
                };
            }
        })
    }
});

app.post("/",(req,res)=>{
    if (req.body.toDo!="") {
        if (req.body.button=="Today"){
            const newItem = new Item ({
                name:req.body.toDo
            });
            console.log(newItem);
            newItem.save();
            res.redirect("/");
        } else {
            const listName = req.body.button;
            const newItem = new Item ({
                name:req.body.toDo
            });
            List.findOne({name:listName},(err,foundList)=>{
                foundList.items.push(newItem);
                foundList.save();
                res.redirect("/"+listName)
            })
        }
    };
})

app.post("/delete",(req,res)=>{
    const listName = req.body.listName;
    const itemName = req.body.checkbox;
    if (listName == "Today"){
        Item.deleteOne({name:itemName},(err)=>{
            if (err){
                console.log(err);
            } else {
                console.log("Successful deletion");
            };
        res.redirect("/")
        });
    } else {
        console.log("finding list...")
        List.findOne({name:listName},(err,foundList)=>{
            if (!err){
                console.log("no errors")
                if (!foundList){
                    console.log("List not found?");
                } else {
                    console.log("list found.")
                    for (let i=0;i<foundList.items.length;i++){
                        if (foundList.items[i].name == itemName){
                            console.log("found",itemName);
                            foundList.items.splice(i,1);
                            foundList.save();
                        }
                    }
                    res.redirect("/"+listName);
                }
            }
        })
    }
});

app.get("/",(req,res)=>{
    Item.find({},(err,items)=>{
        res.render("list",{listTitle: "Today", toDoExtra: items});
    if (items.length === 0){
        Item.insertMany(defaultItems,(err)=>{
            if (err){
                console.log(err);
            } else {
                console.log("Successfully inserted items.");
            }
        })
    };
    })
});

app.get("/about",(req,res)=>{
    res.render("about");
});

app.listen(port,()=>{
    console.log("Server started on port",port,".")
});

// app.get("/:listTitle",(req,res)=>{
//     console.log(listtitle);
//     listtitle = req.params.listTitle;
//     List.findOne({name:listtitle},(err,listt)=>{
//         if (!err){
//         console.log("no error");
//             if (!listt){
//                 console.log("Making new list...")
//                 const list = new List ({
//                     name:listtitle,
//                     items:defaultItems
//                 });
//                 list.save();
//                 res.redirect("/"+listtitle)
//                 console.log("Redirecting to /listtitle");
//             } else {
//                 console.log("Rendering existing database...")
//                 res.render("list",{listTitle:listt.name,toDoExtra:listt.items});
//             }
//         }
//     })
// });