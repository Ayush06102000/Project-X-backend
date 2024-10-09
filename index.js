require('dotenv').config()
const express = require('express');
var cors = require('cors')
const jwt = require('jsonwebtoken');
const { userRouter } = require("./routes/user")
const { productRouter } = require("./routes/product");

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json())
app.use("/api/v1/user",userRouter);
app.use("/api/v1/product",productRouter);

app.listen(port,()=>{
    console.log(`listening to ${port}`)
})
