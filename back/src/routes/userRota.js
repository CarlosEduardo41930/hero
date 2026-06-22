const express = require('express');
const router = express.Router();
const userController = require('../controllers/useControllers');
const token = require('../middlewares/useMiddlewares');

router.post('/cadastro', userController.cadastro);
router.post('/login', userController.login);
router.get('/herois', token.verificaToken, userController.herois);
router.get('/heroi/:id', token.verificaToken, userController.heroi);
router.post('/herois/adicionar',token.verificaToken, userController.novoHeroi);
router.get('/herois/guildas',token.verificaToken, userController.mostrarGuidas);
router.get('/usuario/perfil',token.verificaToken, userController.mostrarPerfil);
router.put('/usuario/perfil/atualizar',token.verificaToken, userController.atualizarPerfil)
router.post('/guilda/adicionar',token.verificaToken, userController.novaGuilda)
router.get('/guilda',token.verificaToken, userController.guildas)
router.post('/missao/adicionar',token.verificaToken, userController.novaMissao)
router.get('/missao',token.verificaToken, userController.missoes)
router.delete('/heroi/:id', token.verificaToken, userController.excluirHeroi);
router.put('/missao/fechar/:id', token.verificaToken, userController.fecharMissao);


module.exports = router;