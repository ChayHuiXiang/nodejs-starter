const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash")

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology:true});
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.json());

port = process.env.PORT;
if (port == "" || port == null){
    port = 3000;
};

const articleSchema = new mongoose.Schema ({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    }
})

const Article = mongoose.model("Article",articleSchema);

app.route("/articles")

.get((req,res)=>{
    Article.find({},(err,foundArticles)=>{
        res.send(foundArticles);
    })
})

.post((req,res)=>{
    const newArticle = new Article ({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save();
    res.redirect("/articles");
})

.delete((req,res)=>{
    Article.deleteMany({},(err)=>{
        if (err) {
            console.log(err);
        }
    })
    res.redirect("articles");
});

app.route("/articles/:articleTitle")

.get((req,res)=>{
    const kebabArtTitle = _.kebabCase(req.params.articleTitle);
    Article.find({},(err,foundArticles)=>{
        const matchedArticles = [];
        foundArticles.forEach((i)=>{
            const kebabtitle = _.kebabCase(i.title);
            if (kebabArtTitle == kebabtitle){
                matchedArticles.push(i);
            }
        });
        res.send(matchedArticles);
    })
})

.put((req,res)=>{
    const kebabArtTitle = _.kebabCase(req.params.articleTitle);
    Article.find({},(err,foundArticles)=>{
        const matchedArticles = []
        foundArticles.forEach((i)=>{
            const kebabtitle = _.kebabCase(i.title)
            if (kebabArtTitle == kebabtitle){
                console.log("Amending article...");
                i.title = req.body.title;
                i.content = req.body.content;
                i.save();
                matchedArticles.push(i);
            }
        });
        res.send(matchedArticles);
    })
})

.patch((req,res)=>{
    const kebabArtTitle = _.kebabCase(req.params.articleTitle);
    Article.find({},(err,foundArticles)=>{
        const matchedArticles = []
        foundArticles.forEach((i)=>{
            const kebabtitle = _.kebabCase(i.title)
            if (kebabArtTitle == kebabtitle){
                if (!req.body.title) {} else{
                    i.title = req.body.title;
                };
                if (!req.body.content) {} else{
                    i.content = req.body.content;
                }
                i.save();
                matchedArticles.push(i);
            }
        });
        res.send(matchedArticles);
    })
})

.delete((req,res)=>{
    const kebabArtTitle = _.kebabCase(req.params.articleTitle);
    Article.find({},(err,foundArticles)=>{
        const matchedArticles = []
        foundArticles.forEach((i)=>{
            const kebabtitle = _.kebabCase(i.title)
            if (kebabArtTitle == kebabtitle){
                matchedArticles.push(i);
                Article.deleteOne({title:i.title},(err)=>{
                    if (err){
                        console.log(err);
                    }
                })
            }
        });
        res.send(matchedArticles);
    })
});

app.listen(port,()=>{
    console.log("Server started on port",port)
});