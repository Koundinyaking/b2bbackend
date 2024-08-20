const express = require("express");
const connection = require("../db");
const router = express.Router();


router.post('/addProduct',async(req,res)=>{
    const {ProductName, Price, Quantity } = req.body;

    if (!ProductName || !Price || !Quantity) {
        return res.status(400).send({ error: "All fields are required." });
    }

    const Productquery = `INSERT INTO products (ProductID,ProductName, Price, Quantity) VALUES (?, ?, ?,?);`

    const [rows] = await connection.query('SELECT ProductID FROM products ORDER BY ProductID DESC LIMIT 1');
    
    let newProductId = "VTSPRD000001"; 
    if (rows.length > 0) {
        const latestProductId = rows[0].ProductID;
        const currentIdNumber = parseInt(latestProductId.slice(-6)); 
        const newIdNumber = currentIdNumber + 1;
        newProductId = `VTSPRD${String(newIdNumber).padStart(6, '0')}`;
    }
    const result = await connection.execute(Productquery, [newProductId,ProductName, Price, Quantity])
    res.status(201).send({ message: "Product added successfully.", ProductID: result.insertId });

});

router.get('/getProducts',async(req, res) => {
    const query1 = `SELECT * FROM products`;
    const results = await connection.query(query1)
    res.status(200).send(results[0])
    
});


module.exports = router;