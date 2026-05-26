const express = require('express');
const router = express.Router();
const contro = require('../controllers/userControllers');

router.post('/cadastrar', contro.addHeroi);
router.get('/herois', contro.getHerois);

module.exports = router;