//jshint esversion:6
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
require('dotenv').config()

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

const APIKey=process.env.APIKEY;
const ListID=process.env.LISTID;

port = process.env.PORT;

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/signup.html");
});

app.post("/",(req,res)=>{
    const firstname = req.body.firstName;
    const lastname = req.body.lastName;
    const email = req.body.email;
    const data = {
        members:[{
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME: firstname,
                LNAME: lastname
            }
        }]
    }
    const JSONdata = JSON.stringify(data);
    const url ="https://us7.api.mailchimp.com/3.0/lists/"+ListID+"?skip_merge_validation=false&skip_duplicate_check=false"
    const options = {
        method: 'POST',
        auth:`HuiXiang:${APIKey}`,
      };
    
    const request = https.request(url,options,(response)=>{
        console.log(response.statusCode);
        if (response.statusCode==200){
            response.on("data",(d)=>{
                const data = JSON.parse(d);
                const error = data.error_count;
                if (error==0){
                    res.sendFile(__dirname+"/public/success.html");
                } else {
                    res.sendFile(__dirname+"/public/failure.html");
                };
            });
        } else {
            res.sendFile(__dirname+"/public/failure.html");
        };
    });
    request.write(JSONdata);
    request.end();
});

port = process.env.PORT;

if (port==null || port==""){
    port=3000;
};

app.listen(port,function(){
    console.log("Server is running on port",port,".");
});

