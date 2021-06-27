const express = require("express");
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

/**
 * CPF - STRING
 * NAME - STRING
 * ID - UUID
 * STATEMENT []
 */

 const customers = [];

app.post('/account', (request, response) => {
  const { cpf, name } = request.body;
  const id =  uuidv4();

  //Inserir dados no array
  customers.push({
    cpf,
    name,
    id,
    statement: []
  })

  return response.status(201).send();
  
})

app.listen(3333);