import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiMostrarHerois } from "../api/apisRotas"
import { useMemo } from "react";
import Cards from "./Cards";

function Home() {
  const navigate = useNavigate();
  const [classeFiltro, setClasseFiltro] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/acesso-negado');
    }
  }, [token, navigate]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['herois'],
    queryFn: apiMostrarHerois,
    enabled: !!token //<---- !!!!! NUNCA MECHER SE NÂO FUNCIONA !!!!!!!
  });


  const heroisFiltrados = useMemo(() => {
  const lista = data?.data.herois ?? [];
  

  if (!classeFiltro) return lista;

  return lista.filter(
    (heroi) => heroi.classe === classeFiltro
  );
}, [data, classeFiltro]);

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center bg-gradient-to-br from-slate-900 to-purple-900 h-[93%]">
        <img src="https://i.postimg.cc/FsymPshK/loading.png" alt="icone de caregando" className={isLoading ? "animate-spin" : ""} />
        <p>Carregando...</p></div>
    )
  };

  if (error) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      localStorage.removeItem('token');
      navigate('/acesso-negado');
      return null;
    }
    return <div className="p-8 text-red-500"><p>Erro ao carregar heróis: {error.message}</p></div>;
  }
const dado = data?.data.use;
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-900 to-purple-900">
      <div className="flex justify-around w-full p-5 text-cyan-50">
        <div className=""><p>Total de Heróis Recrutados: {dado.total_herois}</p></div>
        <div className=""><p>Média de Poder da Equipe: {dado.media_poder}</p></div>
        <div className=""><p>Guilda Mais Forte: {dado.guilda_mais_forte}</p></div>
      </div>
      <div className="flex justify-center p-4">
  <select
    value={classeFiltro}
    onChange={(e) => setClasseFiltro(e.target.value)}
    className="p-2 rounded"
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
      <div className="grid grid-cols-5 gap-5 p-5">
        {data?.status === 204 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] col-span-5 ">
            <img
              src="https://i.postimg.cc/yxP0VYNk/heroi.png"
              alt="imagem de heroi genérica"
              className="w-156 h-156 opacity-70"
            />
            <p className="mt-4 text-gray-400 text-xl font-semibold">
              Sem herói
            </p>
          </div>
        ) : (
          heroisFiltrados.map((heroi) => (
            <Cards key={heroi.id_heroi} heroi={heroi} />
          ))
        )}
      </div>
    </div>
  );
}

export default Home