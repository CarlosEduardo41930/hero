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
    const [resultado] = await db.query("SELECT * FROM heroi WHERE fk_usuario = ?",
        [id]);
        return resultado;
}

exports.heroi = async (id) => {
    const [resultado] = await db.query("SELECT h.*, GROUP_CONCAT(t.titulo SEPARATOR ', ') AS titulos FROM heroi h LEFT JOIN user_heroi_titulo uht ON h.id_heroi = uht.fk_heroi LEFT JOIN titulo t ON uht.fk_titulo = t.id_titulo WHERE h.id_heroi = ? GROUP BY h.id_heroi, h.nome", [id]);
    return resultado;
// não da para colocar INNER JOIN pois o heroi pode não ter titulo
}

exports.novoHeroi = async (nome, guilda_id, classe, imagem, nivel, status,ouro, descricao, id , ordem) => {
    const [resultado] = await db.query("INSERT INTO heroi ( fk_usuario, fk_guilda, nome, classe, imagem, nivel, status, ouro, descricao, ordem) VALUES (?,?,?,?,?,?,?,?,?,?)",[id, guilda_id, nome, classe, imagem, nivel, status, ouro, descricao, ordem]);

    return resultado
}

exports.guildas = async (id) => {
    const [resultado] = await db.query("SELECT id_guilda, nome FROM guilda WHERE fk_usuario = ?",
        [id]);
        return resultado;
}

exports.getPerfil = async (id) => {
    const [resultado] = await db.query("SELECT nome_usuario, nome, email FROM usuario WHERE id_usuario = ?",
        [id]);
        return resultado;
}

exports.getSenha = async (id) => {
    const [resultado] = await db.query("SELECT senha FROM usuario WHERE id_usuario = ?",
        [id]);
        return resultado;
}

exports.editarDados = async (id, nome, usuario, email, senha) => {
    const [resultado] = await db.query("UPDATE usuario SET nome_usuario = ?, nome = ?, email = ?, senha = ?  WHERE id_usuario = ? ", [usuario, nome, email, senha, id]);
    return resultado
}

exports.novaGuilda = async ( nome, pontos, ouro, especializacao, ordem, descricao, fk_usuario) => {

  const [resultado] = await db.query(`INSERT INTO guilda
    ( fk_usuario, nome, pontos, ouro, expose, especializacao, ordem, descricao )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [ fk_usuario, nome, pontos, ouro, "true", especializacao, ordem, descricao ]
  );

  return resultado;
};


exports.guildas = async (idUsuario) => {
  const [rows] = await db.query(`SELECT g.*, GROUP_CONCAT(t.titulo SEPARATOR ', ') AS titulos_guilda FROM guilda g LEFT JOIN user_guilda_titulo ugt ON ugt.fk_guilda = g.id_guilda LEFT JOIN titulo t ON t.id_titulo = ugt.fk_titulo WHERE g.fk_usuario = ? GROUP BY g.id_guilda
  `, [idUsuario]
  );

  return rows;
};

exports.novaMissao = async ( nome, tipo, origem, local_missao, objetivo, recomendacao, recompensa, expose, titulo, nivel, pontos, descricao, limite_participantes, fk_usuario
) => {
   const [resultado] = await db.query(`INSERT INTO missao ( nome, tipo, origem, local_missao, objetivo, recomendacao, recompensa, expose, titulo, nivel, pontos, descricao, limite_participantes, fk_usuario
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [ nome, tipo, origem, local_missao, objetivo, recomendacao, recompensa, expose, titulo, nivel, pontos, descricao, limite_participantes, fk_usuario
    ]
  );
  return resultado;
};

exports.missoes = async (fk_usuario) => {
  const [rows] = await db.query(`SELECT * FROM missao WHERE fk_usuario = ?`,
    [fk_usuario]
  );
  return rows;
};





module.exports = exports;