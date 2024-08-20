const express = require("express");
const bodyParser = require("body-parser");
require('./db')
require('dotenv').config();
const user = require('./Routes/UserRoutes')
const seller = require('./Routes/SellerRoutes')
const buyer = require('./Routes/BuyerRoutes')

const app = express();
const port = 5000;
app.use(bodyParser.json());

app.get('/testing',(req,res)=>{
    res.send("Hello");
});

app.use('/user',user)
app.use('/seller',seller)
app.use('/buyer',buyer)

app.listen(port, () => 
    console.log(`Server is running on port: ${port}`)
);