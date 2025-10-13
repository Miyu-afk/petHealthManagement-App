const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'db_pethealth'
})

app.use(cors());
app.use(express.json());

app.get("/accounts/login/", (req, res) => {
  connection
    .promise()
    .query("SELECT * FROM users") 
      .then(([rows, fields]) => {
      res.json(rows);
      })
      .catch((err) => {
        res.status(500).json({error:err})
      });
    });


app.get("/pets", (req, res) => {
  connection
    .promise()
    .query("SELECT * FROM pets") 
      .then(([rows, fields]) => {
      res.json(rows);
      })
      .catch((err) => {
        res.status(500).json({error:err})
      });
    });

app.post("/pets", async(req, res) => {
  try{
    const { name, mood = null, poop = null, meal = null, vitality = null, record, memo = null, owner_id, pet_id } = req.body;
    const [rows] = await connection
    .promise()
    .query("SELECT * FROM pets WHERE pet_id = ? AND record = ?" , [
      pet_id,
      record,
    ])

  if (rows.length > 0) {
    await connection
    .promise()
    .query(
      `UPDATE pets SET mood = ?, poop = ?, meal = ?, vitality = ?, memo = ? WHERE pet_id = ? AND record = ?`,
      [mood, poop, meal, vitality, memo, pet_id, record]
    );
  } else {
    const insertQuery = `
  INSERT INTO pets (name, mood, poop, meal, vitality, record, memo, owner_id, pet_id)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await connection
      .promise()
      .query(insertQuery, [
        name,
        mood,
        poop,
        meal,
        vitality,
        record,
        memo,
        owner_id,
        pet_id,
      ])
    }
    res.status(200).end();
  }catch(err) {
    console.log(err);
    res.status(500).json({error:err})
      }; 
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
