const { z } = require('zod');


exports.validacaoCadastro = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
  nome_completo: z.coerce.string().min(2, "O nome completo deve ter pelo menos 2 caracteres").max(100, "O nome completo deve ter no máximo 100 caracteres"),
  nome_usuario: z.string().min(2, "O nome de usuário deve ter pelo menos 2 caracteres").max(50, "O nome de usuário deve ter no máximo 50 caracteres")
});

exports.validacaoHeroi = z.object({
  nome: z.coerce.string().min(2, "O nome completo deve ter pelo menos 2 caracteres"),
  classe: z.enum(["guerreiro", "mago", "ladino", "clérigo", "paladino", "bárbaro", "ranger", "bardo", "feiticeiro", "monge",]),
  nivel: z.coerce.number().min(1, "Nivel mínimo é 18").max(300, "Nivel máxima é 60"),
  status: z.enum(["online", "ausente", "offline"]),
  guilda: z.coerce.number(),
  ouro: z.coerce.number(),
  descricao: z.coerce.string().max(255, "A descrição deve ter no máximo 255 caracteres")
});

exports.validacaoPerfil = z.object({
  nome_completo: z.coerce.string().min(2),
  nome_usuario: z.coerce.string().min(3),
  imagem: z.string().url("Insira uma URL válida"),
  email: z.coerce.string().email(),
  atualSenha: z.coerce.string(),
  novaSenha: z.coerce.string()
})

exports.validacaoGuilda = z.object({
  nome: z.string().min(2, 'O nome da guilda deve ter pelo menos 2 caracteres').max(100, 'O nome da guilda deve ter no máximo 100 caracteres'),
  ouro: z.coerce.number().min(0),
  especializacao: z.string().max(100, 'A especialização deve ter no máximo 100 caracteres').optional(),
  descricao: z.string().max(1000, 'A descrição é muito longa').optional(),
});

exports.validacaoMissao = z.object({
  nome: z.coerce.string().min(1),

  tipo: z.coerce.string().optional(),
  origem: z.coerce.string().optional(),
  local_missao: z.coerce.string().optional(),

  objetivo: z.coerce.string().optional(),
  recomendacao: z.coerce.string().optional(),
  recompensa: z.coerce.string().optional(),

  titulo: z.string().optional(),

  nivel: z.coerce.number().int().optional(),
  pontos: z.coerce.number().int().optional(),

  descricao: z.coerce.string().optional(),

  limite_participantes: z.coerce.number().int().min(1)
});

module.exports = exports;