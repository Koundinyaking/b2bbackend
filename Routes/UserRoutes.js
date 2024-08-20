const express = require("express");
const connection = require("../db");
const router = express.Router();

router.post('/registration', async (req, res) => {
  try {
    const q1 = 'CREATE TABLE IF NOT EXISTS Users (UserID VARCHAR(255) PRIMARY KEY, Email VARCHAR(255) Default NULL, Pwd VARCHAR(255) Default NULL, Company_Name VARCHAR(255), GST_No VARCHAR(255), Mobile_No VARCHAR(255))';

    await connection.query(q1);
    const { Email, Pwd, Company_Name, GST_No, Mobile_No } = req.body;
    const RegQuery = 'INSERT INTO Users(UserID,Email,Pwd,Company_Name,GST_No,Mobile_No) VALUES(?,?,?,?,?,?)';

    const [rows] = await connection.query('SELECT UserID FROM Users ORDER BY UserID DESC LIMIT 1');
    
    let newUserId = "VTSB2B000001"; 
    if (rows.length > 0) {
        const latestUserId = rows[0].UserID;
        const currentIdNumber = parseInt(latestUserId.slice(-6)); 
        const newIdNumber = currentIdNumber + 1;
        newUserId = `VTSB2B${String(newIdNumber).padStart(6, '0')}`;
    }

    await connection.query(RegQuery, [newUserId, Email, Pwd, Company_Name, GST_No, Mobile_No]);
    res.send({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});


router.post('/payment', async (req, res) => {
    try {
      const { PaymentDate,PaymentMethod, PaymentStatus, Amount } = req.body;
  
      const PaymentQuery = 'INSERT INTO Payments(PaymentID, PaymentDate, PaymentMethod, PaymentStatus, Amount, UTR) VALUES(?,?,?,?,?,?)';
  
      const [rows] = await connection.query('SELECT PaymentID FROM Payments ORDER BY PaymentID DESC LIMIT 1');
      
      let newPaymentId = "PAY000001"; 
      if (rows.length > 0) {
        const latestPaymentId = rows[0].PaymentID;
        const currentIdNumber = parseInt(latestPaymentId.slice(-6)); 
        const newIdNumber = currentIdNumber + 1;
        newPaymentId = `PAY${String(newIdNumber).padStart(6, '0')}`;
      }
  
      const newUTR = `UTR${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  
      await connection.query(PaymentQuery, [newPaymentId, PaymentDate, PaymentMethod, PaymentStatus, Amount, newUTR]);
      res.send({ message: "Payment processed successfully", PaymentID: newPaymentId, UTR: newUTR });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: 'An error occurred while processing the payment' });
    }
});
  
  

module.exports = router;
