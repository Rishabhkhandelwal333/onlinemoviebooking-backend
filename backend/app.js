const express = require("express");
const cors = require('cors');
const app = express();
const cookieParser = require ("cookie-parser");
const bodyparser = require("body-parser");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./midlleware/error");
const path = require("path");


__dirname = path.resolve()

//config

if(process.env.NODE_ENV !=="PRODUCTION"){
    require("dotenv").config({path:"backend/config/config.env"});
}

app.use(express.json())
app.use(cookieParser());
app.use(cors());
app.use(bodyparser.urlencoded({extended:true}));
app.use(fileUpload());

// route imports 

const movie = require("./routes/movieRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use("/api/v1",movie);
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use("/api/v1",payment);
app.get('/', (req, res) => {
    res.send('Hello World!')
  });
// app.use(express.static(path.join(__dirname,"../frontend/build")));

// app.get("*",(req,res)=>{
//     res.sendFile(path.resolve(__dirname,'frontend','build','index.html'));
// })
//Middleware for error 
app.use(errorMiddleware);

module.exports=app
