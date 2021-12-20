const EventEmitter = require("events");

class Logger extends EventEmitter {
    log(message){
        // display message
        console.log(message);
        // emits event
        this.emit("message logged",message);
    }
};

module.exports = Logger;