import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { apiMissoesHeroi, apiCompletarMissao } from "../api/apisRotas";
import { motion, AnimatePresence } from 'framer-motion';

function HeroiMissoes() {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    if (!token) navigate("/acesso-negado");
  }, [token, navigate]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["heroisMissoes", id],
    queryFn: () => apiMissoesHeroi(id),
    enabled: !!token,
  });

  const completar = useMutation({
    mutationFn: (missaoId) => apiCompletarMissao(id, missaoId),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["heroisMissoes", id]);
      setMensagem({ tipo: "sucesso", texto: res.data.message });
      setTimeout(() => setMensagem(null), 4000);
    },
    onError: (err) => {
      setMensagem({
        tipo: "erro",
        texto: err.response?.data?.message || err.response?.data?.erro || "Erro ao completar missão",
      });
      setTimeout(() => setMensagem(null), 4000);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center">
        <img src="https://i.postimg.cc/FsymPshK/loading.png" alt="loading" className="animate-spin" />
        <p className="text-white mt-2">Carregando...</p>
      </div>
    );
  }

  if (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      navigate("/acesso-negado");
      return null;
    }
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center">
        <p className="text-red-400">Erro ao carregar missões.</p>
      </div>
    );
  }

  const disponiveis = data?.data?.disponiveis || [];
  const completas = data?.data?.completas || [];

  return (
    <div className="min-h-[calc(100vh-72px)] p-6">
      <Link to={`/heroi/${id}`}>
        <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-lg border border-white/10 transition mb-6">
          ← Voltar
        </button>
      </Link>

      <AnimatePresence>
        {mensagem && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`mb-6 p-4 rounded-lg border ${
              mensagem.tipo === "sucesso"
                ? "bg-green-500/20 border-green-500/40 text-green-300"
                : "bg-red-500/20 border-red-500/40 text-red-300"
            }`}
          >
            <p className="text-sm text-center font-medium">{mensagem.texto}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {completar.isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300"
          >
            <p className="text-sm text-center font-medium">Processando missão...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-2xl text-white font-bold mb-4">
        Missões Concluídas <span className="text-gray-400">({completas.length})</span>
      </h2>

      {completas.length === 0 ? (
        <p className="text-gray-400 mb-10">Nenhuma missão concluída ainda.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {completas.map((m, index) => (
            <motion.div
              key={m.id_missao}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white/5 border border-white/10 p-5 rounded-xl opacity-70"
            >
              <h3 className="font-bold text-white">{m.nome}</h3>
              <div className="mt-2 space-y-1">
                <p className="text-gray-400 text-sm">Pontos: <span className="text-purple-300">{m.pontos || 0}</span></p>
                <p className="text-gray-400 text-sm">Ouro: <span className="text-yellow-400">{m.ouro || 0}</span></p>
                {m.titulo && <p className="text-gray-400 text-sm">Título: <span className="text-yellow-400">{m.titulo}</span></p>}
                <p className="text-gray-400 text-sm">Participante: <span className="text-white">#{m.quantidade}</span></p>
              </div>
              <span className="inline-block mt-3 bg-gray-600/50 text-gray-300 text-xs px-3 py-1 rounded-full">Concluída</span>
            </motion.div>
          ))}
        </div>
      )}

      <h2 className="text-2xl text-white font-bold mb-4">
        Missões Disponíveis <span className="text-gray-400">({disponiveis.length})</span>
      </h2>

      {disponiveis.length === 0 ? (
        <p className="text-gray-400">Nenhuma missão disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {disponiveis.map((m, index) => (
            <motion.div
              key={m.id_missao}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 p-5 hover:border-purple-400/40 transition-colors"
            >
              <h3 className="font-bold text-lg text-white">{m.nome}</h3>
              <div className="mt-2 space-y-1">
                <p className="text-gray-300 text-sm">Tipo: <span className="text-white">{m.tipo || "—"}</span></p>
                <p className="text-gray-300 text-sm">Local: <span className="text-white">{m.local_missao || "—"}</span></p>
                <p className="text-gray-300 text-sm">Objetivo: <span className="text-white">{m.objetivo || "—"}</span></p>
                <p className="text-gray-300 text-sm">Nível: <span className="text-white">{m.nivel || "—"}</span></p>
                <p className="text-gray-300 text-sm">Pontos: <span className="text-purple-300">{m.pontos || 0}</span></p>
                <p className="text-gray-300 text-sm">Ouro: <span className="text-yellow-400">{m.ouro || 0}</span></p>
                {m.titulo && <p className="text-gray-300 text-sm">Título: <span className="text-yellow-400">{m.titulo}</span></p>}
                {m.recompensa && <p className="text-gray-300 text-sm">Recompensa: <span className="text-white">{m.recompensa}</span></p>}
                <p className="text-gray-500 text-xs mt-1">Limite: {m.limite_participantes} participantes</p>
              </div>
              <button
                onClick={() => completar.mutate(m.id_missao)}
                disabled={completar.isPending}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-lg transition hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
              >
                {completar.isPending ? "Completando..." : "Completar Missão"}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HeroiMissoes;