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

  // Verificar se já existe o cpf, cadastrado
  const customersAlreadyExists =  customers.some(
    (customers) => customers.cpf === cpf
  );

  if(customersAlreadyExists) {
    return response.status(400).json({
      error: "Customer already exists!"
    })
  }

  //Inserir dados no array
  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: []
  })

  return response.status(201).send();
  
})

app.listen(3333);