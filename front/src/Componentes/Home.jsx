import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { apiMostrarHerois } from "../api/apisRotas"
import Cards from "./Cards";

function Home() {
  const navigate = useNavigate();
  const [classeFiltro, setClasseFiltro] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) navigate('/acesso-negado');
  }, [token, navigate]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['herois'],
    queryFn: apiMostrarHerois,
    enabled: !!token
  });

  const heroisFiltrados = useMemo(() => {
    const lista = data?.data?.herois ?? [];
    if (!classeFiltro) return lista;
    return lista.filter((heroi) => heroi.classe === classeFiltro);
  }, [data, classeFiltro]);

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
        <p className="text-red-400">Erro ao carregar heróis: {error.message}</p>
      </div>
    );
  }

  const dado = data?.data?.use;

  return (
    <div className="min-h-[calc(100vh-72px)] p-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 p-4 text-center">
          <p className="text-gray-400 text-sm">Heróis Recrutados</p>
          <p className="text-2xl font-bold text-white">{dado?.total_herois}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 p-4 text-center">
          <p className="text-gray-400 text-sm">Média de Poder</p>
          <p className="text-2xl font-bold text-purple-300">{dado?.media_poder}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 p-4 text-center">
          <p className="text-gray-400 text-sm">Guilda Mais Forte</p>
          <p className="text-2xl font-bold text-yellow-400">{dado?.guilda_mais_forte}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <select
          value={classeFiltro}
          onChange={(e) => setClasseFiltro(e.target.value)}
          className="rounded-lg border border-white/20 bg-slate-800 px-4 py-2 text-white focus:border-purple-400 focus:outline-none"
        >
          <option value="">Todas as classes</option>
          <option value="guerreiro">Guerreiro</option>
          <option value="mago">Mago</option>
          <option value="ladino">Ladino</option>
          <option value="clérigo">Clérigo</option>
          <option value="paladino">Paladino</option>
          <option value="bárbaro">Bárbaro</option>
          <option value="ranger">Ranger</option>
          <option value="bardo">Bardo</option>
          <option value="feiticeiro">Feiticeiro</option>
          <option value="monge">Monge</option>
        </select>
      </div>

      {data?.status === 204 || heroisFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <p className="text-gray-400 text-xl font-semibold">Nenhum herói encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {heroisFiltrados.map((heroi) => (
            <Cards key={heroi.id_heroi} heroi={heroi} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home