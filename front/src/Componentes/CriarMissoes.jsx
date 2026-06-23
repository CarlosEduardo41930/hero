import { z } from "zod";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiCriarMissao } from "../api/apisRotas";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';

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
  const [ouro, setOuro] = useState("");
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
    ouro: z.coerce.number().int().min(0).optional(),
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
    const dados = { nome, tipo, origem, local_missao, objetivo, recomendacao, recompensa, titulo, nivel, pontos, ouro, descricao, limite_participantes };
    const validacao = validacaoMissao.safeParse(dados);
    if (validacao.success) {
      mutation.mutate(validacao.data);
    } else {
      setErro(Object.values(validacao.error.flatten().fieldErrors).flat());
    }
  };

  const inputClass = "w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 focus:outline-none transition";
  const labelClass = "mb-1.5 block text-sm font-medium text-purple-300";

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white/10 p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Criar Missão</h1>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Nome da Missão *</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da missão..." className={inputClass} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tipo</label>
              <input value={tipo} onChange={(e) => setTipo(e.target.value)} placeholder="Ex: Caça, Coleta..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Origem</label>
              <input value={origem} onChange={(e) => setOrigem(e.target.value)} placeholder="De onde vem..." className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Local da Missão</label>
            <input value={local_missao} onChange={(e) => setLocalMissao(e.target.value)} placeholder="Onde acontece..." className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Título (recompensa)</label>
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título que o herói recebe..." className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Objetivo</label>
            <input value={objetivo} onChange={(e) => setObjetivo(e.target.value)} placeholder="O que deve ser feito..." className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Recomendação</label>
            <input value={recomendacao} onChange={(e) => setRecomendacao(e.target.value)} placeholder="Dica para o herói..." className={inputClass} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Nível</label>
              <input type="number" value={nivel} onChange={(e) => setNivel(e.target.value)} placeholder="0" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Pontos (XP)</label>
              <input type="number" value={pontos} onChange={(e) => setPontos(e.target.value)} placeholder="0" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Ouro</label>
              <input type="number" value={ouro} onChange={(e) => setOuro(e.target.value)} placeholder="0" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Recompensa (texto)</label>
            <input value={recompensa} onChange={(e) => setRecompensa(e.target.value)} placeholder="Descrição da recompensa..." className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Limite de Participantes *</label>
            <input type="number" value={limite_participantes} onChange={(e) => setLimite(e.target.value)} placeholder="1" className={inputClass} required />
          </div>

          <div>
            <label className={labelClass}>Descrição</label>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Detalhes da missão..." className={`${inputClass} resize-none h-24`} />
          </div>
        </div>

        <button type="submit" disabled={mutation.isPending}
          className="w-full mt-6 rounded-lg bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100">
          {mutation.isPending ? 'Criando...' : 'Criar Missão'}
        </button>

        <AnimatePresence>
          {erro.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="mt-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg"
            >
              {erro.map((msg, i) => (
                <p key={i} className="text-red-300 text-sm text-center">{msg}</p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}

export default CriarMissoes;