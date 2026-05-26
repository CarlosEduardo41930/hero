const db = require('../config/db');

exports.addHeroi = async (req, res) => {
    try {
        const { nome, classe, imagem, status, nivel } = req.body;
        await db.query("INSERT INTO personagem (nome, classe, imagem, status, aparecer, nivel) VALUES (?, ?, ?, ?, ?, ?)", [nome, classe, imagem, status, 1, nivel]);
        res.status(201).json({ mensagem: "Salvado no Banco de dados!" });
    } catch (error) {
        res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}

exports.getHerois = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM personagem ORDER BY id DESC"); 
        res.json(rows);
    } catch (error) {
        res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}