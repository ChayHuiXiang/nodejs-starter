const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));

let port=process.env.PORT;
if (port==" " || port==null){
    port=3000;
}
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});

app.post("/",(req,res)=>{
    const cityname = req.body.cityName;
    console.log("cityname");
    url="https://api.openweathermap.org/data/2.5/weather?q="+cityname+"&appid=81691afd6ec0f96942f119e5d52a6bae#"
    https.get(url,function(response){

        if (response.statusCode==200){
            response.on("data",(d)=>{
                const information = JSON.parse(d);
                const weather = information.weather[0].description;
                const icon = information.weather[0].icon;
                const iconURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
                res.write("<h1> The weather is "+weather+".</h1>");
                res.write("<img src='"+iconURL+"'>")
                res.send();
            });
        } 
        else {
            console.log("Data not obtained.");
        }
    
    });
});

app.get("/:city",(req,res)=>{


});

app.listen(port,function(){
    console.log("Connecting to Port",port,"...")});

    // const city = req.params.city;
    // url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=81691afd6ec0f96942f119e5d52a6bae#"
    // https.get(url,function(response){

    //     if (response.statusCode==200){
    //         response.on("data",(d)=>{
    //             const information = JSON.parse(d);
    //             const weather = information.weather[0].description;
    //             const icon = information.weather[0].icon;
    //             const iconURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
    //             res.write("<h1> The weather is "+weather+".</h1>");
    //             res.write("<img src='"+iconURL+"'>")
    //             res.send();
    //         });
    //     } 
    //     else {
    //         console.log("Data not obtained.");
    //     }

    // });