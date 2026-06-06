const express = require('express');
const cors = require('cors');
const routes = require('./src/routes/userRota');

const app = express();
app.use(cors());
app.use(express.json());


app.use(routes);

app.listen(418, () => {
  console.log('Acesse http://localhost:418 para testar a API');
  console.log('O servidor se recusa a preparar café por ser um bule de chá');
});