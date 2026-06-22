const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verificaToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Padrão Bearer TOKEN

  if (!token) return res.status(403).json({ message: 'Nenhum token fornecido!' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido ou expirado!" });

    // Salvar o ID do usuário na requisição
    req.user = decoded;
    next();
  })
};




module.exports = exports;