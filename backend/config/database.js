const mongoose = require("mongoose");

const connectDatabase = ()=>{
    mongoose.connect(process.env.CLOUD_URI).then((data)=>{
        console.log(`mongo db running : ${data.connection.host}`);
    });
}

module.exports = connectDatabase

