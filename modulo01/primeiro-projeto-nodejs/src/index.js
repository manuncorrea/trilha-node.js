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

 // Middleware 
 function verifyExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers;
  const customer = customers.find((customer) => customer.cpf === cpf);

  if(!customer) {
    return response.status(400).json({
      error: "Customer not found" //CPF NÃO EXISTE
    });
  }

  request.customer = customer;

  return next();
 }

//Calculo para saque
 function getBalance(statement) {
  const balance = statement.reduce((acc, opration) => {
    if(opration.type === 'credit') {
      return acc + opration.amount;
    } else {
      return acc - opration.amount;
    }
  }, 0);

  return balance;
 }

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
  
});

app.get("/statement", verifyExistsAccountCPF, (request, response) => {
  const { customer } = request;
  return response.json(customer.statement);
});

//Inserir deposito
app.post("/deposit", verifyExistsAccountCPF, (request, response) => {
  const { description, amount } = request.body;

  const { customer } = request;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit"
  }

  customer.statement.push(statementOperation);

  return response.status(201).send();

});

// Criando o saque da conta
app.post("/withdraw", verifyExistsAccountCPF, (request, response) => {
  const { amount } = request.body;
  const { customer } = request;

  const balance = getBalance(customer.statement);

  if(balance < amount ){
    return response.status(400).json({ error: 'Insufficient founds" '}); // salado infuciente
  }

  const statementOperation = {
    amount,
    created_at: new Date(), 
    type: 'debit',
  }

  customer.statement.push(statementOperation);

  return response.status(201).send();

});

// Lidando extrato bancario por data
app.get("/statement/date", verifyExistsAccountCPF, (request, response) => {
  const { customer } = request;
  const { date } = request.query;

  const dateFormat = new Date( date + " 00:00");

 const statement = customer.statement.filter((statement) =>
  statement.created_at.toDateString() === new Date(dateFormat).toDateString()
 );

 return response.json(statement);
});

app.listen(3333);