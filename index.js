const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
const bodyparser = require("body-parser");
const config = require("./config");

const app = express();

app.use(express.json());//na saida 
app.use(cors());
app.use(bodyparser.json());//na entrada 

var conString = config.urlConnection;

var client = new Client(conString);

client.connect((err) => {
  if (err) {
    return console.error('Não foi possível conectar ao banco.', err);
  }
  client.query('SELECT NOW()', (err, result) => {
    if (err) {
      return console.error('Erro ao executar a query.', err);
    }
    console.log(result.rows[0]);
  });
});

app.get("/", (req, res) => {
  console.log("Response ok.");//vai para powershell
  res.send("Ok – Servidor disponível.");//vai p browser
});



/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

app.post('/quantidade', (req, res) => {
  try {
    console.log("Alguém enviou um post com os dados:", req.body);
    const { dadoa, dadoc, resultado } = req.body;
    client.query(
      "INSERT INTO quantidade (dadoa, dadoc, resultado) VALUES ($1, $2, $3) RETURNING * ", [dadoa, dadoc, resultado],
      (err, result) => {
        if (err) {
          return console.error("Erro ao executar a qry de INSERT no quantidade", err);
        }
        res.status(201).json(result.rows[0]);
        console.log(result);
      }
    );
  } catch (erro) {
    console.error(erro);
  }
})

app.get("/quantidade", (req, res) => {
  try {
    client.query("SELECT * FROM quantidade", function (err, result) {
      if (err) {
        return console.error("Erro ao executar a qry de SELECT", err);
      }
      res.send(result.rows);
      console.log("Rota: get quantidade");
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(config.port, () =>
  console.log("Servidor funcionando na porta " + config.port)
);

module.exports = app; 