const http = require("http")
const server = http.createServer((req,res)=>{
    if (req.url==="/"){
        res.write("Hello World");
        res.end();
    };
    if (req.url==="/api/courses"){
        res.write(JSON.stringify([0,1,2,3]));
        res.end();
    };
})
server.listen(3000);
console.log("Listening on Port 3000...");

server.on("connection",(socket)=>{
    console.log("New Connection");
});