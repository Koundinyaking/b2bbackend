const express = require("express");
const connection = require("../db");
const router = express.Router();


router.post('/addToCart',async (req, res) => {
    try {
        const { userId, productId, quantity, totalAmount } = req.body;
        if (!userId || !productId || !quantity || !totalAmount) {
            return res.status(400).send({ error: "All fields are required..." });
        }
        const query = `INSERT INTO carts(UserID,ProductID,Quantity,TotalAmount) VALUES (?, ?, ?, ?)`;
        await connection.execute(query, [userId, productId, quantity, totalAmount ]);
        return res.status(201).send({ message: "Product Added to cart.."})
    } catch (error) {
        console.log("Error in cart:", error);
        return res.status(500).send({ error: "Internal server error." });
    }

})

router.get('/cartProducts/:id',async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ error: "Parameter is required..." });
        }
        const query = `SELECT * FROM carts WHERE UserID = ?`;
        const result = await connection.execute(query, [id]);
        res.status(200).send(result[0]);
    } catch (error) {
        console.log("Error in cart:", err.stack);
        return res.status(500).send({ error: "Internal server error." });
    }
})

router.delete('/removeProduct/:userId/:productId',async(req, res) => {
    try {
        const { userId, productId } = req.params;
    if (!userId || !productId) {
        return res.status(400).send({ error: "Params are required..." });
    }
    const DeleteQuery = `DELETE FROM carts WHERE UserID = ? AND ProductID = ?`;
    await connection.execute(DeleteQuery, [userId, productId]);
    res.status(200).send({message: "Product Deleted from cart..."});

    } catch(error){
        console.log("Error in delete cart:", error);
        return res.status(500).send({ error: "Internal server error." });
    
    }
});


router.post('/order',async (req, res) => {
    try {
        const { UserID, ProductID, OrderStatus, PaymentStatus, PaymentID, Amount} = req.body;

        if (!UserID || !ProductID || !OrderStatus || !PaymentStatus || !PaymentID || !Amount) {
            return res.status(400).send({ error: "All fields are required." });
        }

        const query = `
        INSERT INTO orders (UserID, ProductID, OrderStatus, PaymentStatus, PaymentID, Amount) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

        await connection.execute(query, [UserID, ProductID, OrderStatus, PaymentStatus, PaymentID, Amount]);
        const query2 = `DELETE FROM cart WHERE UserID = ? AND ProductID = ?`;
        await connection.execute(query2, [UserID, ProductID]);
        res.status(201).send({message: "Order confirmed...🥳🥳🥳"});
    }
   catch (error) {
        console.error('Error adding order:', error);
        return res.status(500).send({ error: "Internal server error." });
    }
});

module.exports = router;