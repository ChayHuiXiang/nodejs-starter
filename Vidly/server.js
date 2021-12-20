const express = require("express");
const Joi = require("joi");

const app = express();

app.use(express.json());
const genres = [
    {id:1,name:"Action"},
    {id:2,name:"Rock"},
    {id:3,name:"HipHop"},
]

app.get("/api/genres/",(req,res)=>{
    res.send(genres);
});

app.get("/api/genres/:id",(req,res)=>{
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.send("The Genre ID was not found").status(404);

    res.send(genre);
});

app.post("/api/genres/",(req,res)=>{
    const result = validateGenre(req.body);
    if (result.error){
        res.status(400).send("Please enter valid genre.");
        return;
    }

    const genre = {
        id: genres.length+1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});

app.put("/api/genres/:id",(req,res)=>{
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.send("The Genre ID was not found").status(404);

    const result = validateGenre(req.body);
    if (result.error){
        res.status(400).send("Please enter valid genre.");
        return;
    }

    genre.name=req.body.name;
    res.send(genre);

});

app.delete("/api/genres/:id",(req,res)=>{
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.send("The Genre ID was not found").status(404);

    res.send(genre);
    genres.splice(parseInt(req.params.id)-1,1);
});

port = process.env.PORT;
if (port == null || port == ""){
    port = 3000;
};
app.listen(port);
console.log("Listening to Port",port,"...");

function validateGenre(Genre){
    const schema = Joi.object({
        name: Joi.string().min(1).required()
    });
    return schema.validate(Genre);
}

// app.get("/api/courses/:id",(req,res)=>{
//     const course = courses.find(c => c.id === parseInt(req.params.id));
//     if (!course) return res.send("The course ID was not found").status(404);
//     res.send(course);
// });