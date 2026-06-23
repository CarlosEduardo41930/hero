const sql = require('../model/useModel');
const heroiRanks = require('../api/herois');
const guildaRanks = require('../api/guildas');
const z = require('../zod/useZod');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();



function processarLevelUp(heroi) {
  while (true) {
    const rankAtual = heroiRanks.find(r => heroi.nivel >= r.nivel_min && heroi.nivel <= r.nivel_max);
    if (!rankAtual) break;
    if (heroi.xps < rankAtual.pontos_xps) break;

    const excesso = heroi.xps - rankAtual.pontos_xps;

    if (heroi.nivel < rankAtual.nivel_max) {
      heroi.nivel++;
      heroi.xps = excesso;
    } else if (heroi.nivel === rankAtual.nivel_max) {
      if (heroi.ouro >= rankAtual.ouro_necesario) {
        heroi.nivel++;
        heroi.xps = excesso;
        heroi.ouro -= rankAtual.ouro_necesario;
      } else {
        heroi.ouro += Math.ceil(excesso * 0.05);
        heroi.xps = 0;
        break;
      }
    }
  }

  const novoRank = heroiRanks.find(r => heroi.nivel >= r.nivel_min && heroi.nivel <= r.nivel_max);
  if (novoRank) {
    heroi.ordem = novoRank.ordem;
  }

  return heroi;
}


exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const rows = await sql.login(email);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }
    const user = rows[0];
    const lerSenha = await bcrypt.compare(senha, user.senha);
    if (lerSenha) {
      const token = jwt.sign({ usuario: user.nome_usuario, id: user.id_usuario }, process.env.JWT_SECRET, { expiresIn: '5h' });
      const dados = user.nome_usuario;
      return res.status(200).json({ message: 'Login realizado com sucesso!', token, dados });
    } else {
      return res.status(400).json({ message: 'Senha incorreta!' });
    }
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

exports.cadastro = async (req, res) => {
  const { email, senha, nome_completo, nome_usuario } = req.body;
  try {
    const validacao = z.validacaoCadastro.safeParse({ email, senha, nome_completo, nome_usuario });
    const verificar = await sql.verificarCadastro(email);
    if (verificar.length > 0) {
      return res.status(409).json({ message: 'E-mail já cadastrado!' });
    }
    if (!validacao.success) {
      return res.status(400).json({ message: 'Dados de cadastro inválidos!', errors: validacao.error.issues });
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    const dados = await sql.cadastrarUsuario(email, senhaHash, nome_completo, nome_usuario);
    const token = jwt.sign({ usuario: nome_usuario, id: dados.insertId }, process.env.JWT_SECRET, { expiresIn: '5h' });
    const dado = nome_usuario
    return res.status(200).json({ message: 'Cadastro realizado com sucesso!', token, dado });
  } catch (error) {
    console.error('Erro ao validar cadastro:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

exports.herois = async (req, res) => {
  try {
    const rows = await sql.herois(req.user.id);
    if (!rows || rows.length === 0) {
      return res.status(204).json({ message: 'vazio' });
    }
    const heroisComRank = rows.map(h => {
      const nivelHeroi = parseInt(h.nivel);
      const rank = heroiRanks.find(r => nivelHeroi >= r.nivel_min && nivelHeroi <= r.nivel_max) || {};
      return {
        ...h,
        xp: h.xps,
        nome_rank: rank.nome_rank,
        cor: rank.cor,
        titulos: rank.titulos,
        pontos_xps: rank.pontos_xps
      };
    });
    const paraUsuario = await sql.dadosParaUsuario(req.user.id);
    res.json({ herois: heroisComRank, use: paraUsuario });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.heroi = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await sql.heroi(id);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Herói não encontrado!' });
    }
    const heroisComRank = rows.map(h => {
      const nivelHeroi = parseInt(h.nivel);
      const rank = heroiRanks.find(r => nivelHeroi >= r.nivel_min && nivelHeroi <= r.nivel_max) || {};
      return {
        ...h,
        xp: h.xps,
        nome_rank: rank.nome_rank,
        cor: rank.cor,
        titulos: rank.titulos + (h.titulos ? `, ${h.titulos}` : ''),
        pontos_xps: rank.pontos_xps
      };
    });
    res.json(heroisComRank[0]);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.novoHeroi = async (req, res) => {
  const { nome, guilda, classe, imagem, nivel, status, ouro, descricao } = req.body;
  try {
    const validacao = z.validacaoHeroi.safeParse({ nome, guilda, classe, imagem, nivel, status, ouro, descricao });
    if (!validacao.success) {
      return res.status(400).json({ message: 'Dados de cadastro do heroi inválidos!', errors: validacao.error.issues });
    }
    const rank = heroiRanks.find(r => nivel >= r.nivel_min && nivel <= r.nivel_max) || {};
    const dados = await sql.novoHeroi(nome, guilda, classe, imagem, nivel, status, ouro, descricao, req.user.id, rank.ordem);
    return res.status(200).json({ message: 'Cadastro de heroi realizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao validar cadastro:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

exports.mostrarGuidas = async (req, res) => {
  try {
    const rows = await sql.guildas(req.user.id);
    if (!rows || rows.length === 0) {
      return res.status(204).json({ message: 'vazio' });
    }
    return res.status(200).json({ message: 'Guildas encontradas', rows });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.mostrarPerfil = async (req, res) => {
  try {
    const rows = await sql.getPerfil(req.user.id);
    return res.status(200).json({ message: 'Guildas encontradas', rows });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.atualizarPerfil = async (req, res) => {
  const { nome_completo, nome_usuario, email, atualSenha, novaSenha } = req.body;
  try {
    const validacao = z.validacaoPerfil.safeParse({ nome_completo, nome_usuario, email, atualSenha, novaSenha });
    const verificar = await sql.verificarCadastro(email);
    if (verificar.length > 0 && verificar[0].id_usuario !== req.user.id) {
      return res.status(409).json({ message: 'E-mail já cadastrado!' });
    }
    if (!validacao.success) {
      return res.status(400).json({ message: 'Dados de do perfil inválidos!', errors: validacao.error.issues });
    }
    const senhaAtual = await sql.getSenha(req.user.id);

    if (atualSenha !== "" && novaSenha !== "") {
      const lerSenha = await bcrypt.compare(atualSenha, senhaAtual[0].senha);
      if (lerSenha) {
        const senhaHash = await bcrypt.hash(novaSenha, 10);
        const editar = await sql.editarDados(req.user.id, nome_completo, nome_usuario, email, senhaHash);
        return res.status(200).json({ message: 'Dados alterados com sucesso!' });
      }
      if (!lerSenha) {
        return res.status(401).json({ message: 'Senha atual incorreta!' });
      }
    } else if ((atualSenha && !novaSenha) || (!atualSenha && novaSenha)) {
      return res.status(400).json({ message: 'Preencha a senha atual e a nova senha.' });
    } else {
      const editar = await sql.editarDados(req.user.id, nome_completo, nome_usuario, email, senhaAtual[0].senha);
      return res.status(200).json({ message: 'Dados alterados com sucesso!' });
    }
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

exports.novaGuilda = async (req, res) => {
  const { nome, ouro, especializacao, descricao } = req.body;
  try {
    const validacao = z.validacaoGuilda.safeParse({ nome, ouro, especializacao, descricao });
    if (!validacao.success) {
      return res.status(400).json({
        message: 'Dados de cadastro da guilda inválidos!',
        errors: validacao.error.issues
      });
    }
    const pontos = 0;
    const rank = guildaRanks.find(r => pontos >= r.nivel_min && pontos <= r.nivel_max) || {};
    await sql.novaGuilda(nome, pontos, ouro, especializacao, rank.ordem, descricao, req.user.id);
    return res.status(200).json({ message: 'Cadastro de guilda realizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao validar cadastro:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

exports.guildas = async (req, res) => {
  try {
    const rows = await sql.guildas(req.user.id);
    if (!rows || rows.length === 0) {
      return res.status(204).json({ message: 'vazio' });
    }
    const guildasComRank = rows.map(g => {
      const pontosGuilda = parseInt(g.pontos);
      const rank = guildaRanks.find(r => pontosGuilda >= r.nivel_min && pontosGuilda <= r.nivel_max) || {};
      return {
        ...g,
        nome_rank: rank.nome_rank,
        cor: rank.cor,
        titulos: rank.titulos + (g.titulos_guilda ? `, ${g.titulos_guilda}` : ''),
      };
    });
    res.json(guildasComRank);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.novaMissao = async (req, res) => {
  const { nome, tipo, origem, local_missao, objetivo, recomendacao, recompensa, titulo, nivel, pontos, ouro, descricao, limite_participantes } = req.body;
  try {
    const expose = "true";
    const validacao = z.validacaoMissao.safeParse({ nome, tipo, origem, local_missao, objetivo, recomendacao, recompensa, titulo, nivel, pontos, ouro, descricao, limite_participantes });
    if (!validacao.success) {
      return res.status(400).json({
        message: "Dados da missão inválidos!",
        errors: validacao.error.issues
      });
    }
    await sql.novaMissao(nome, tipo, origem, local_missao, objetivo, recomendacao, recompensa, expose, titulo, nivel, pontos, ouro, descricao, limite_participantes, req.user.id);
    return res.status(200).json({ message: "Missão criada com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

exports.missoes = async (req, res) => {
  try {
    const rows = await sql.missoes(req.user.id);
    if (!rows || rows.length === 0) {
      return res.status(204).json({ message: "vazio" });
    }
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

exports.excluirHeroi = async (req, res) => {
  try {
    const { id } = req.params;
    const heroi = await sql.heroi(id);
    if (!heroi || heroi.length === 0) {
      return res.status(404).json({ message: 'Herói não encontrado' });
    }
    await sql.excluirHeroi(id);
    return res.status(200).json({ message: 'Herói removido com sucesso' });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

exports.fecharMissao = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await sql.fecharMissao(id, req.user.id);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        message: "Missão não encontrada ou não pertence ao usuário"
      });
    }
    return res.json({ message: "Missão finalizada com sucesso" });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

exports.completarMissao = async (req, res) => {
  try {
    const { heroiId, missaoId } = req.params;

    const heroiDados = await sql.getHeroiDados(heroiId);
    if (!heroiDados || heroiDados.fk_usuario !== req.user.id) {
      return res.status(403).json({ message: 'Herói não pertence ao usuário' });
    }

    const missaoDados = await sql.getMissaoDados(missaoId);
    if (!missaoDados || missaoDados.expose !== 'true') {
      return res.status(404).json({ message: 'Missão não encontrada ou indisponível' });
    }

    const jaCompletou = await sql.verificarMissaoCompleta(heroiId, missaoId);
    if (jaCompletou) {
      return res.status(409).json({ message: 'Herói já completou esta missão' });
    }

    const participantesAtuais = await sql.verificarLimiteParticipantes(missaoId);
    if (participantesAtuais >= missaoDados.limite_participantes) {
      return res.status(409).json({ message: 'Limite de participantes atingido' });
    }

    let heroiAtualizado = {
      nivel: Number(heroiDados.nivel) || 1,
      xps: (Number(heroiDados.xps) || 0) + (Number(missaoDados.pontos) || 0),
      ouro: (Number(heroiDados.ouro) || 0) + (Number(missaoDados.ouro) || 0),
      ordem: Number(heroiDados.ordem) || 1
    };

    if (missaoDados.titulo) {
      let tituloRecord = await sql.getTituloByText(missaoDados.titulo);
      if (!tituloRecord) {
        const novoId = await sql.criarTitulo(missaoDados.titulo, req.user.id);
        tituloRecord = { id_titulo: novoId };
      }
      const jaTemTitulo = await sql.heroiJaTemTitulo(heroiId, tituloRecord.id_titulo);
      if (!jaTemTitulo) {
        await sql.adicionarTituloHeroi(heroiId, tituloRecord.id_titulo);
      }
    }

    heroiAtualizado = processarLevelUp(heroiAtualizado);

    await sql.atualizarHeroi(heroiId, heroiAtualizado.nivel, heroiAtualizado.xps, heroiAtualizado.ouro, heroiAtualizado.ordem);

    if (heroiDados.fk_guilda) {
      const guildaDados = await sql.getGuildaDados(heroiDados.fk_guilda);
      if (guildaDados) {
        const novosPontos = guildaDados.pontos + (missaoDados.pontos || 0);
        const novoOuroGuilda = guildaDados.ouro + (missaoDados.ouro || 0);
        const rankGuilda = guildaRanks.find(r => novosPontos >= r.nivel_min && novosPontos <= r.nivel_max);
        const novaOrdemGuilda = rankGuilda ? rankGuilda.ordem : guildaDados.ordem;
        await sql.atualizarGuilda(heroiDados.fk_guilda, novosPontos, novoOuroGuilda, novaOrdemGuilda);
      }
    }

    await sql.completarMissaoHeroi(heroiId, missaoId);

    const participantesAgora = await sql.verificarLimiteParticipantes(missaoId);
    if (participantesAgora >= missaoDados.limite_participantes) {
      await sql.fecharMissaoAuto(missaoId);
    }

    return res.status(200).json({
      message: 'Missão completada com sucesso!',
      heroi: {
        nivel: heroiAtualizado.nivel,
        xps: heroiAtualizado.xps,
        ouro: heroiAtualizado.ouro
      }
    });

  } catch (error) {
    console.error('Erro ao completar missão:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

exports.missoesHeroi = async (req, res) => {
  try {
    const { id } = req.params;

    const heroiDados = await sql.getHeroiDados(id);
    if (!heroiDados || heroiDados.fk_usuario !== req.user.id) {
      return res.status(403).json({ message: 'Herói não pertence ao usuário' });
    }

    const disponiveis = await sql.getMissoesDisponiveisParaHeroi(id);
    const completas = await sql.getMissoesCompletasPorHeroi(id);
    console.log('HEROI:', id);
    console.log('DISPONIVEIS:', JSON.stringify(disponiveis.map(m => ({ id: m.id_missao, nome: m.nome }))));
    console.log('COMPLETAS:', JSON.stringify(completas.map(m => ({ id: m.id_missao, nome: m.nome }))));

    return res.status(200).json({ disponiveis, completas });

  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

module.exports = exports;