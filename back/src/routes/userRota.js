const express = require('express');
const router = express.Router();
const userController = require('../controllers/useControllers');

router.post('/cadastro', userController.cadastro);
router.post('/login', userController.login);

module.exports = router;