const express = require("express");
const Joi = require("joi");
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});

app.post("/",(req,res)=>{
    var num1 = parseInt(req.body.num1);
    var num2 = parseInt(req.body.num2);
    var result = num1 + num2;
    console.log(result);

    res.send("The result of the calculation is"+result);
});

app.get("/bmicalculator",(req,res)=>{
    res.sendFile(__dirname+"/bmiCalculator.html");
})

app.post("/bmicalculator",(req,res)=>{
    var weight = parseFloat(req.body.weight);
    var height = parseFloat(req.body.height);
    var BMI = weight/(height*height);
    res.send("Your BMI is "+BMI+".");
});

let port = process.env.PORT;
if (port == null || port == ""){
    port = 3000;
};
app.listen(port);
console.log("Listening to Port",port,"...");