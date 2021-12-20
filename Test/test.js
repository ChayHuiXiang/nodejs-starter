const Logger = require("./module")
const logs = new Logger();
logs.on("message logged",function(args){
    console.log("Message: ",args);
});

logs.log("Hello");