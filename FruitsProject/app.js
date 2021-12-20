const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/fruitsDB");

const fruitSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true,"Please check your data entry, no name specified!"]
    },
    rating: {
        type:Number,
        min:0,
        max:10
    },
    review: String
});

const personSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please check your data entry, no name specified!"]
    },
    age:Number,
    favouritefruit:fruitSchema
});

const Fruit = mongoose.model("Fruit",fruitSchema);

const orange = new Fruit ({
    rating: 4,
    Review:"Best."
});

const apple = new Fruit ({
    name: "Apple",
    rating: 7,
    review: "Good fruit"
});

const grapes = new Fruit ({
    name:"Grapes",
    rating:10,
    review:"Best fruit!"
});

const pear = new Fruit ({
    name:"Pear",
    rating:4,
    review:"Not that good of a fruit."
});

const pineapple = new Fruit ({
    name:"Pineapple",
    rating:3,
    review:"Okay fruit."
});

const banana = new Fruit ({
    name:"Banana",
    rating:7,
    review:"Not bad."
});

// banana.save();

// Fruit.deleteOne({name:"orange"},(err)=>{
//     if (err){
//         console.log(err);
//     } else {
//         console.log("Successfully deleted orange.");
//     };
// });

const Person = mongoose.model("Person",personSchema);

// Person.updateOne({name:"John"},{favouritefruit:banana},(err)=>{
//     if (err){
//         console.log(err);
//     } else {
//         console.log("Updated favourite fruit for John.");
//         mongoose.connection.close();
//     };
// });

const John = new Person ({
    name:"John",
    age:37
});

const Amy = new Person ({
    name:"Amy",
    age:12,
    favouritefruit:pineapple
})

// Person.insertMany([John,Amy],(err)=>{
//     if (err){
//         console.log(err);
//     } else {
//         console.log("Successfully saved people.");
//         mongoose.connection.close();
//     };
// });

// Fruit.insertMany([apple,grapes,pear],(err)=>{
//     if (err){
//         console.log(err);
//     } else {
//         console.log("Successfully saved fruits.");
//     };
// });

// Fruit.find((err,res)=>{
//     if (err){
//         console.log(err);
//     } else {
//         res.forEach((f)=>{
//             console.log(f.name);
//         });
//         mongoose.connection.close();
//     };
// });
