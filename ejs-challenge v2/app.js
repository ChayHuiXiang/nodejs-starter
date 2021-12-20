//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser:true,useUnifiedTopology:true});

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

let postTitle;
let postBody;

const postsSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  body:{
    type:String,
    required:true
  }
});

const shortPostsSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  body:{
    type:String,
    required:true
  }
})

const Post = mongoose.model("Post",postsSchema);
const ShortPost = mongoose.model("ShortPost",shortPostsSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.json());

app.get("/",(req,res)=>{
  ShortPost.findOne({title:postTitle},(err,doc)=>{
    if (!err){
      if (!doc){
        console.log("doc not found!");
      } else {
        console.log(doc);
        const newPost = new Post ({
          _id:doc._id,
          title:postTitle,
          body:postBody
        });
        newPost.save();
      }
    }
  });
  ShortPost.find({},(err,foundPosts)=>{
    if (!err){
      res.render("home",{homeStartingContent:homeStartingContent,shortenedPosts:foundPosts});
    }
  })
});

app.get("/posts/:postID",(req,res)=>{
  // posts.forEach((i)=>{
  //   let kebabTitle = lodash.kebabCase(i.title);
  //   let kebabPostName = lodash.kebabCase(req.params.postName)
  //   if (kebabTitle == kebabPostName){
  //     matchedPost = i
  //     res.render("post",{matchedPost:matchedPost})
  //   };
  // });
  Post.find({_id:req.params.postID},(err,foundPost)=>{
    if (!err){
      if (!foundPost){
        console.log("foundPost error");
      } else {
        console.log(foundPost);
        res.render("post",{matchedPost:foundPost})
      }
    }
  })
});

app.get("/about",(req,res)=>{
  res.render("about",{aboutContent:aboutContent});
});

app.get("/contact",(req,res)=>{
  res.render("contact",{contactContent:contactContent});
});

app.get("/compose",(req,res)=>{
  res.render("compose");
});

app.post("/compose",(req,res)=>{

  const shortPostTitle = req.body.title;
  postTitle = req.body.title;
  postBody = req.body.post;

  let shortPostBody;

  if (req.body.post.length>100){
    shortPostBody = req.body.post.substring(0,100)+"...";
  } else {
    shortPostBody = req.body.post;
  }

  const newShortPost = new ShortPost ({
    title:shortPostTitle,
    body:shortPostBody
  });
  newShortPost.save();

  console.log(shortPostTitle);
  console.log(req.body.title);
  res.redirect("/");
});

port = process.env.PORT;
if (port == "" || port == null){
  port=3000;
}

app.listen(port, function() {
  console.log("Server started on port",port);
});
