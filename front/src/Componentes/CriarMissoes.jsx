import { z } from "zod";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiCriarMissao } from "../api/apisRotas";
import { useNavigate } from "react-router-dom";

function CriarMissoes() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [origem, setOrigem] = useState("");
  const [local_missao, setLocalMissao] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [recomendacao, setRecomendacao] = useState("");
  const [recompensa, setRecompensa] = useState("");
  const [titulo, setTitulo] = useState("");
  const [nivel, setNivel] = useState("");
  const [pontos, setPontos] = useState("");
  const [descricao, setDescricao] = useState("");
  const [limite_participantes, setLimite] = useState("");

  const [erro, setErro] = useState([]);
  const navigate = useNavigate();

  const validacaoMissao = z.object({
    nome: z.string().min(1, "Nome obrigatório"),
    tipo: z.string().optional(),
    origem: z.string().optional(),
    local_missao: z.string().optional(),
    objetivo: z.string().optional(),
    recomendacao: z.string().optional(),
    recompensa: z.string().optional(),
    titulo: z.string().optional(),
    nivel: z.coerce.number().optional(),
    pontos: z.coerce.number().optional(),
    descricao: z.string().optional(),
    limite_participantes: z.coerce.number().min(1)
  });

  const mutation = useMutation({
    mutationFn: apiCriarMissao,
    onSuccess: () => navigate("/missoes"),
    onError: (error) => {
      const data = error.response?.data;

      const mensagens = [
        data?.message,
        ...(data?.errors?.map((e) => e.message) || [])
      ].filter(Boolean);

      setErro(mensagens);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro([]);

    const dados = {
      nome,
      tipo,
      origem,
      local_missao,
      objetivo,
      recomendacao,
      recompensa,
      titulo,
      nivel,
      pontos,
      descricao,
      limite_participantes,
    };

    const validacao = validacaoMissao.safeParse(dados);

    if (validacao.success) {
      mutation.mutate(validacao.data);
    } else {
      setErro(
        Object.values(validacao.error.flatten().fieldErrors).flat()
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Criar Missão</h1>

      <div>

        <label>Nome da Missão *</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} />

        <label>Tipo</label>
        <input value={tipo} onChange={(e) => setTipo(e.target.value)} />

        <label>Origem</label>
        <input value={origem} onChange={(e) => setOrigem(e.target.value)} />

        <label>Local da Missão</label>
        <input value={local_missao} onChange={(e) => setLocalMissao(e.target.value)} />

        <label>Título</label>
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />

        <label>Objetivo</label>
        <input value={objetivo} onChange={(e) => setObjetivo(e.target.value)} />

        <label>Recomendação</label>
        <input value={recomendacao} onChange={(e) => setRecomendacao(e.target.value)} />

        <label>Nível</label>
        <input type="number" value={nivel} onChange={(e) => setNivel(e.target.value)} />

        <label>Pontos</label>
        <input type="number" value={pontos} onChange={(e) => setPontos(e.target.value)} />

        <label>Recompensa</label>
        <input value={recompensa} onChange={(e) => setRecompensa(e.target.value)} />

        <label>Limite de Participantes *</label>
        <input
          type="number"
          value={limite_participantes}
          onChange={(e) => setLimite(e.target.value)}
        />

        <label>Descrição</label>
        <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />

      </div>

      <button type="submit">
        Criar Missão
      </button>

      {erro.length > 0 && (
        <ul>
          {erro.map((msg, i) => (
            <li key={i} style={{ color: "red" }}>
              {msg}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

export default CriarMissoes;