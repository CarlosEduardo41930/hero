const db = require('../config/db');
const heroi = require('../api/herois');
const gilda = require('../api/guildas');
const z = require('zod');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const validacaoCadastro = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
  nome_completo: z.string().min(2, "O nome completo deve ter pelo menos 2 caracteres").max(100, "O nome completo deve ter no máximo 100 caracteres"),
  nome_usuario: z.string().min(2, "O nome de usuário deve ter pelo menos 2 caracteres").max(50, "O nome de usuário deve ter no máximo 50 caracteres")
});


exports.verificaToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Padrão Bearer TOKEN

  if (!token) return res.status(403).json({ message: 'Nenhum token fornecido!' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido ou expirado!" });

    // Salvar o ID do usuário na requisição
    req.userId = decoded.id;
    next();
  })
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }
    const user = rows[0];
    const lerSenha = await bcrypt.compare(senha, user.senha);
    if (lerSenha) {
      const token = jwt.sign({ usuario: user.nome_usuario, id: user.id_usuario }, process.env.JWT_SECRET, { expiresIn: '5h' });
      const dados = { id_usuario: user.id_usuario, nome_usuario: user.nome_usuario };
      return res.status(200).json({ message: 'Login realizado com sucesso!', token, dados });
    } else {
      return res.status(401).json({ message: 'Senha incorreta!' });
    }

  } catch (error) {
    console.error('Erro ao realizar login:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

exports.cadastro = async (req, res) => {
  const { email, senha, nome_completo, nome_usuario } = req.body;
  try {
    const validacao = validacaoCadastro.safeParse({ email, senha, nome_completo, nome_usuario });

    if (!validacao.success) {
      return res.status(400).json({ message: 'Dados de cadastro inválidos!', errors: validacao.error.issues });
    }
    const senhaHash = await bcrypt.hash(senha, 10);

    await db.query('INSERT INTO usuario (email, senha, nome, nome_usuario) VALUES (?, ?, ?, ?)', [email, senhaHash, nome_completo, nome_usuario]);
    return res.status(200).json({ message: 'Cadastro realizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao validar cadastro:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

exports.herois = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM heroi WHERE fk_usuario = ?", [req.userId]);
    const heroisComRank = rows.map(h => {
      const nivelHeroi = parseInt(h.nivel);
      const rank = heroi.find(r => nivelHeroi >= r.nivel_min && nivelHeroi <= r.nivel_max) || {};
      return {
        ...h,
        xp: h.xsp,
        nome_rank: rank.nome_rank,
        cor: rank.cor,
        titulos: rank.titulos,
        pontos_xps: rank.pontos_xps

      };
    });

    res.json(heroisComRank);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}
exports.heroi = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT h.*, t.id_titulo, t.titulo FROM heroi h LEFT JOIN user_heroi_titulo uht    ON h.id_heroi = uht.fk_heroi LEFT JOIN titulo t ON uht.fk_titulo = t.id_titulo WHERE h.id_heroi = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Herói não encontrado!' });
    }

    const heroisComRank = rows.map(h => {
      const nivelHeroi = parseInt(h.nivel);
      const rank = heroi.find(r => nivelHeroi >= r.nivel_min && nivelHeroi <= r.nivel_max) || {};
      return {
        ...h,
        xp: h.xsp,
        nome_rank: rank.nome_rank,
        cor: rank.cor,
        titulos: rank.titulos + (h.titulo ? `, ${h.titulo}` : ''),
        pontos_xps: rank.pontos_xps
      };
    });

    res.json(heroisComRank[0]);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

// exports.novoHeroi = async (req, res) => {
//   const { nome, guilda_id, classe, imagem, nivel, status, descricao } = req.body;
//   try {}


module.exports = exports;