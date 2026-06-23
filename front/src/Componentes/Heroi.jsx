import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { heroi, apiExcluirHeroi } from '../api/apisRotas';
import { motion, AnimatePresence } from 'framer-motion';

function Heroi() {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/acesso-negado');
    }
  }, [token, navigate]);

  const excluirHeroi = useMutation({
    mutationFn: (id) => apiExcluirHeroi(id),
    onSuccess: () => navigate("/"),
    onError: (error) => console.log("Erro ao excluir:", error)
  });

  function handleDelete() {
    if (window.confirm("Tem certeza que deseja excluir este herói?")) {
      excluirHeroi.mutate(id);
    }
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['personagem', id],
    queryFn: () => heroi(id),
    enabled: !!token
  });

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center">
        <img src="https://i.postimg.cc/FsymPshK/loading.png" alt="carregando" className="animate-spin" />
        <p className="text-white mt-2">Carregando...</p>
      </div>
    )
  }

  if (error) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      localStorage.removeItem('token');
      navigate('/acesso-negado');
      return null;
    }
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center">
        <p className="text-red-400">Erro ao carregar herói: {error.message}</p>
      </div>
    );
  }

  const dados = data.data || data;

  return (
    <div className="min-h-[calc(100vh-72px)] p-6">
      <Link to="/">
        <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-lg border border-white/10 transition mb-6">
          ← Voltar
        </button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="relative">
          <img src={dados.imagem} alt={dados.nome} className="w-full h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <h1 className="text-3xl font-bold text-white">{dados.nome}</h1>
            <p className="text-sm font-semibold" style={{ color: dados.cor }}>{dados.nome_rank}</p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Classe</span>
                <span className="text-white capitalize">{dados.classe}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Nível</span>
                <span className="text-white">{dados.nivel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className={`px-2 py-0.5 text-xs rounded-full font-semibold text-white ${
                  dados.status === 'online' ? 'bg-green-500' :
                  dados.status === 'ausente' ? 'bg-yellow-500' : 'bg-gray-500'
                }`}>{dados.status}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">XP</span>
                <span className="text-purple-300">{dados.xps}/{dados.pontos_xps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ouro</span>
                <span className="text-yellow-400">{dados.ouro}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rank</span>
                <span className="font-semibold" style={{ color: dados.cor }}>{dados.nome_rank}</span>
              </div>
            </div>
          </div>

          {dados.titulos && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-gray-400 text-sm">Títulos: </span>
              <span className="text-yellow-400/80 text-sm">{dados.titulos}</span>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate(`/heroi/${id}/missoes`)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-lg transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Ver Missões
            </button>
            <button
              onClick={handleDelete}
              disabled={excluirHeroi.isPending}
              className="bg-red-600/80 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-lg transition hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
            >
              {excluirHeroi.isPending ? "Excluindo..." : "Excluir"}
            </button>
          </div>

          <AnimatePresence>
            {excluirHeroi.isError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg"
              >
                <p className="text-red-300 text-sm text-center">Erro ao excluir herói</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default Heroi;