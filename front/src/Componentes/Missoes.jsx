import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiMissoes, apiFecharMissao } from "../api/apisRotas";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';

function Missoes() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [menuAberto, setMenuAberto] = useState(null);
  const [mensagem, setMensagem] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["missoes"],
    queryFn: apiMissoes
  });

  const fecharMissao = useMutation({
    mutationFn: (id) => apiFecharMissao(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["missoes"]);
      setMensagem({ tipo: "sucesso", texto: "Missão fechada com sucesso!" });
      setTimeout(() => setMensagem(null), 3000);
    },
    onError: (error) => {
      setMensagem({
        tipo: "erro",
        texto: error.response?.data?.erro || error.response?.data?.message || "Erro ao fechar missão"
      });
      setTimeout(() => setMensagem(null), 3000);
    }
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

  const lista = data?.data || [];

  return (
    <div className="min-h-[calc(100vh-72px)] p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-white font-bold">Missões</h1>
        <button
          onClick={() => navigate("/missoes/novo")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg transition hover:scale-[1.02] active:scale-[0.98]"
        >
          + Criar Missão
        </button>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lista.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] col-span-full">
            <p className="text-gray-400 text-xl font-semibold">Sem missões cadastradas</p>
            <button
              onClick={() => navigate("/missoes/novo")}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition"
            >
              Criar primeira missão
            </button>
          </div>
        ) : (
          lista.map((m, index) => (
            <motion.div
              key={m.id_missao}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 p-5 hover:border-purple-400/40 transition-colors relative"
            >
              <button
                onClick={() => setMenuAberto(menuAberto === m.id_missao ? null : m.id_missao)}
                className="absolute top-3 right-3 text-white/60 hover:text-white text-xl transition"
              >
                ⋮
              </button>

              <AnimatePresence>
                {menuAberto === m.id_missao && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -5 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-12 right-3 bg-slate-800 shadow-xl rounded-xl p-3 w-44 z-10 border border-white/10"
                  >
                    <button onClick={() => setMenuAberto(null)} className="absolute top-2 right-2 text-gray-500 hover:text-red-400 text-sm">✕</button>
                    <button
                      onClick={() => { fecharMissao.mutate(m.id_missao); setMenuAberto(null); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-green-400 font-medium text-sm transition mt-4"
                    >
                      Fechar Missão
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <h2 className="font-bold text-lg text-white pr-8">{m.nome}</h2>
              <div className="mt-2 space-y-1">
                <p className="text-gray-300 text-sm">Tipo: <span className="text-white">{m.tipo || "—"}</span></p>
                <p className="text-gray-300 text-sm">Local: <span className="text-white">{m.local_missao || "—"}</span></p>
                <p className="text-gray-300 text-sm">Nível: <span className="text-white">{m.nivel || "—"}</span></p>
                <p className="text-gray-300 text-sm">Pontos: <span className="text-purple-300">{m.pontos || 0}</span></p>
                <p className="text-gray-300 text-sm">Ouro: <span className="text-yellow-400">{m.ouro || 0}</span></p>
                {m.titulo && <p className="text-gray-300 text-sm">Título: <span className="text-yellow-400">{m.titulo}</span></p>}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default Missoes;