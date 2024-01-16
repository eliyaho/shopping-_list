// index.js בשרת

const express = require('express');
const { createPool } = require('mysql');
const cors = require('cors');
const app = express();
const port = 4000;

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "list_of_products",
  connectionLimit: 10
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  pool.query(`
      SELECT * FROM bakery_products
      UNION
      SELECT * FROM cleaning_products
      UNION
      SELECT * FROM fruits
      UNION
      SELECT * FROM vegetables
  `, function (err, result, fields) {
      if (err) {
          return res.status(500).send(err.message);
      }
      return res.json(result);
  });
});
app.get('/:category', (req, res) => {
  const category = req.params.category;
  pool.query(`SELECT * FROM ${category}`, function (err, result, fields) {
    if (err) {
      return res.status(500).send(err.message);
    }
    return res.json(result);
  });
});
app.get('/cart', (req, res) => {
  pool.query('SELECT * FROM cart', function (err, result, fields) {
    if (err) {
      return res.status(500).send(err.message);
    }
    return res.json(result);
  });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
