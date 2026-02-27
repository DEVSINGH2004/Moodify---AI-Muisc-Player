const mongoose = require("mongoose")

 function connectToDb(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("connected to database")
    })
    .catch((err)=>{
        console.log("database error",err)
    })
}

module.exports = connectToDb;