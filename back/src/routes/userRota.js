const express = require('express');
const router = express.Router();
const userController = require('../controllers/useControllers');

router.post('/cadastro', userController.cadastro);
router.post('/login', userController.login);
router.get('/herois', userController.verificaToken, userController.herois);
router.get('/heroi/:id', userController.verificaToken, userController.heroi);

module.exports = router;