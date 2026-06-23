const db = require('../config/db');

exports.cadastrarUsuario = async (email, senha, nome_completo, nome_usuario) => {
  const [resultado] = await db.query(
    "INSERT INTO usuario (email, senha, nome, nome_usuario) VALUES(?,?,?,?) ",
    [email, senha, nome_completo, nome_usuario]
  );
  return resultado;
};

exports.verificarCadastro = async (email) => {
  const [resultado] = await db.query(
    "SELECT id_usuario, email FROM usuario WHERE email = ?",
    [email]
  );
  return resultado;
};

exports.login = async (email) => {
  const [resultado] = await db.query(
    "SELECT * FROM usuario WHERE email = ?",
    [email]
  );
  return resultado;
};

exports.herois = async (id) => {
  const [resultado] = await db.query(
    "SELECT * FROM heroi WHERE fk_usuario = ?",
    [id]
  );
  return resultado;
};

exports.heroi = async (id) => {
  const [resultado] = await db.query(
    "SELECT h.*, GROUP_CONCAT(t.titulo SEPARATOR ', ') AS titulos FROM heroi h LEFT JOIN user_heroi_titulo uht ON h.id_heroi = uht.fk_heroi LEFT JOIN titulo t ON uht.fk_titulo = t.id_titulo WHERE h.id_heroi = ? GROUP BY h.id_heroi, h.nome",
    [id]
  );
  return resultado;
};

exports.novoHeroi = async (nome, guilda_id, classe, imagem, nivel, status, ouro, descricao, id, ordem) => {
  const [resultado] = await db.query(
    "INSERT INTO heroi (fk_usuario, fk_guilda, nome, classe, imagem, nivel, status, ouro, descricao, ordem) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [id, guilda_id, nome, classe, imagem, nivel, status, ouro, descricao, ordem]
  );
  return resultado;
};

exports.guildas = async (idUsuario) => {
  const [rows] = await db.query(
    `SELECT g.*, GROUP_CONCAT(t.titulo SEPARATOR ', ') AS titulos_guilda
     FROM guilda g
     LEFT JOIN user_guilda_titulo ugt ON ugt.fk_guilda = g.id_guilda
     LEFT JOIN titulo t ON t.id_titulo = ugt.fk_titulo
     WHERE g.fk_usuario = ?
     GROUP BY g.id_guilda`,
    [idUsuario]
  );
  return rows;
};

exports.getPerfil = async (id) => {
  const [resultado] = await db.query(
    "SELECT nome_usuario, nome, email FROM usuario WHERE id_usuario = ?",
    [id]
  );
  return resultado;
};

exports.getSenha = async (id) => {
  const [resultado] = await db.query(
    "SELECT senha FROM usuario WHERE id_usuario = ?",
    [id]
  );
  return resultado;
};

exports.editarDados = async (id, nome, usuario, email, senha) => {
  const [resultado] = await db.query(
    "UPDATE usuario SET nome_usuario = ?, nome = ?, email = ?, senha = ? WHERE id_usuario = ?",
    [usuario, nome, email, senha, id]
  );
  return resultado;
};

exports.novaGuilda = async (nome, pontos, ouro, especializacao, ordem, descricao, fk_usuario) => {
  const [resultado] = await db.query(
    `INSERT INTO guilda (fk_usuario, nome, pontos, ouro, expose, especializacao, ordem, descricao)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [fk_usuario, nome, pontos, ouro, "true", especializacao, ordem, descricao]
  );
  return resultado;
};

exports.novaMissao = async (nome, tipo, origem, local_missao, objetivo, recomendacao, recompensa, expose, titulo, nivel, pontos, ouro, descricao, limite_participantes, fk_usuario) => {
  const [resultado] = await db.query(
    `INSERT INTO missao (nome, tipo, origem, local_missao, objetivo, recomendacao, recompensa, expose, titulo, nivel, pontos, ouro, descricao, limite_participantes, fk_usuario)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nome, tipo, origem, local_missao, objetivo, recomendacao, recompensa, expose, titulo, nivel, pontos, ouro, descricao, limite_participantes, fk_usuario]
  );
  return resultado;
};

exports.missoes = async (fk_usuario) => {
  const [rows] = await db.query(
    `SELECT * FROM missao WHERE fk_usuario = ? AND expose = 'true'`,
    [fk_usuario]
  );
  return rows;
};

exports.excluirHeroi = async (id) => {
  const [result] = await db.query(
    'DELETE FROM heroi WHERE id_heroi = ?',
    [id]
  );
  return result;
};

exports.dadosParaUsuario = async (fk_usuario) => {
  const [rows] = await db.query(`
    SELECT
      (SELECT COUNT(*) FROM heroi WHERE fk_usuario = u.id_usuario) AS total_herois,
      (SELECT AVG(nivel) FROM heroi WHERE fk_usuario = u.id_usuario) AS media_poder,
      (SELECT nome FROM guilda WHERE fk_usuario = u.id_usuario ORDER BY pontos DESC LIMIT 1) AS guilda_mais_forte
    FROM usuario u
    WHERE u.id_usuario = ?
  `, [fk_usuario]);

  const data = rows[0];

  return {
    total_herois: data.total_herois ?? 0,
    media_poder: data.media_poder ? Number(data.media_poder) : 0,
    guilda_mais_forte: data.guilda_mais_forte ?? "Nenhuma guilda"
  };
};

exports.fecharMissao = async (missaoId, usuarioId) => {
  const [resultado] = await db.query(
    `UPDATE missao SET expose = 'false' WHERE id_missao = ? AND fk_usuario = ?`,
    [missaoId, usuarioId]
  );
  return resultado;
};


exports.getHeroiDados = async (id) => {
  const [resultado] = await db.query(
    `SELECT h.id_heroi, h.fk_usuario, h.fk_guilda, h.nivel, h.xps, h.ouro, h.ordem, h.nome
     FROM heroi h
     WHERE h.id_heroi = ?`,
    [id]
  );
  return resultado[0] || null;
};

exports.getMissaoDados = async (id) => {
  const [resultado] = await db.query(
    "SELECT * FROM missao WHERE id_missao = ?",
    [id]
  );
  return resultado[0] || null;
};

exports.verificarMissaoCompleta = async (fk_heroi, fk_missao) => {
  const [resultado] = await db.query(
    "SELECT id_heroi_missao FROM heroi_missao WHERE fk_heroi = ? AND fk_missao = ? AND completa = 1",
    [fk_heroi, fk_missao]
  );
  return resultado.length > 0;
};

exports.verificarLimiteParticipantes = async (fk_missao) => {
  const [resultado] = await db.query(
    `SELECT COUNT(*) AS total
     FROM heroi_missao hm
     INNER JOIN missao m ON m.id_missao = hm.fk_missao
     WHERE hm.fk_missao = ? AND hm.completa = 1`,
    [fk_missao]
  );
  return resultado[0].total;
};

exports.completarMissaoHeroi = async (fk_heroi, fk_missao) => {
  const [contagem] = await db.query(
    "SELECT COUNT(*) AS total FROM heroi_missao WHERE fk_missao = ? AND completa = 1",
    [fk_missao]
  );
  const participanteNumero = contagem[0].total + 1;

  const [resultado] = await db.query(
    "INSERT INTO heroi_missao (fk_heroi, fk_missao, expose, completa, quantidade) VALUES (?, ?, 'true', 1, ?)",
    [fk_heroi, fk_missao, participanteNumero]
  );
  return resultado;
};

exports.getTituloByText = async (tituloTexto) => {
  const [resultado] = await db.query(
    "SELECT id_titulo FROM titulo WHERE titulo = ?",
    [tituloTexto]
  );
  return resultado[0] || null;
};

exports.criarTitulo = async (tituloTexto, fk_usuario) => {
  const [resultado] = await db.query(
    "INSERT INTO titulo (titulo, fk_usuario) VALUES (?, ?)",
    [tituloTexto, fk_usuario]
  );
  return resultado.insertId;
};

exports.heroiJaTemTitulo = async (fk_heroi, fk_titulo) => {
  const [resultado] = await db.query(
    "SELECT 1 FROM user_heroi_titulo WHERE fk_heroi = ? AND fk_titulo = ?",
    [fk_heroi, fk_titulo]
  );
  return resultado.length > 0;
};

exports.adicionarTituloHeroi = async (fk_heroi, fk_titulo) => {
  const [resultado] = await db.query(
    "INSERT INTO user_heroi_titulo (fk_heroi, fk_titulo) VALUES (?, ?)",
    [fk_heroi, fk_titulo]
  );
  return resultado;
};

exports.atualizarHeroi = async (id, nivel, xps, ouro, ordem) => {
  const [resultado] = await db.query(
    "UPDATE heroi SET nivel = ?, xps = ?, ouro = ?, ordem = ? WHERE id_heroi = ?",
    [nivel, xps, ouro, ordem, id]
  );
  return resultado;
};

exports.getGuildaDados = async (id) => {
  const [resultado] = await db.query(
    "SELECT id_guilda, pontos, ouro, ordem FROM guilda WHERE id_guilda = ?",
    [id]
  );
  return resultado[0] || null;
};

exports.atualizarGuilda = async (id, pontos, ouro, ordem) => {
  const [resultado] = await db.query(
    "UPDATE guilda SET pontos = ?, ouro = ?, ordem = ? WHERE id_guilda = ?",
    [pontos, ouro, ordem, id]
  );
  return resultado;
};

exports.getMissoesDisponiveisParaHeroi = async (fk_heroi) => {
  const [resultado] = await db.query(
    `SELECT m.* FROM missao m
     LEFT JOIN heroi_missao hm
       ON hm.fk_missao = m.id_missao
       AND hm.fk_heroi = ?
       AND hm.completa = 1
     WHERE m.expose = 'true'
       AND hm.id_heroi_missao IS NULL`,
    [fk_heroi]
  );
  return resultado;
};

exports.getMissoesCompletasPorHeroi = async (fk_heroi) => {
  const [resultado] = await db.query(
    `SELECT m.id_missao, m.nome, m.tipo, m.local_missao, m.pontos, m.ouro, m.titulo, m.recompensa,
            hm.quantidade, hm.fk_missao
     FROM heroi_missao hm
     INNER JOIN missao m ON m.id_missao = hm.fk_missao
     WHERE hm.fk_heroi = ? AND hm.completa = 1`,
    [fk_heroi]
  );
  return resultado;
};

exports.fecharMissaoAuto = async (missaoId) => {
  const [resultado] = await db.query(
    "UPDATE missao SET expose = 'false' WHERE id_missao = ?",
    [missaoId]
  );
  return resultado;
};

module.exports = exports;