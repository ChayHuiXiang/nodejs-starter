const express = require("express");
const Joi = require("joi");

const app = express();

app.use(express.json());

const courses = [
    {id:1,name:"course1"},
    {id:2,name:"course2"},
    {id:3,name:"course3"},
];

app.get("/",(req,res)=>{
    res.send("Hello World!!!");
});

app.get("/api/courses",(req,res)=>{
    res.send(courses);
});

app.post("/api/courses",(req,res)=>{
    const ans = validateCourse(req.body);
    if (ans.error) {
        res.status(400).send(ans.error.details[0].message);
        return;
    }

    const course = {
        id: courses.length+1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put("/api/courses/:id",(req,res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.send("The course ID was not found").status(404);

    const ans = validateCourse(req.body);

    if (ans.error) {
        res.status(400).send(ans.error.details[0].message);
        return;
    };
    course.name = req.body.name;
    res.send(course);
});

app.delete("/api/courses/:id",(req,res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.send("The course ID was not found").status(404);

    res.send(course);
    courses.splice(parseInt(req.params.id)-1,1);
});

const port = process.env.PORT || 3000;

function validateCourse(Course){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(Course);
}

app.listen((port),function(){
    console.log("Listening on port",port,"...");
});
