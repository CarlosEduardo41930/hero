import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { heroi, apiExcluirHeroi } from '../api/apisRotas';


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
    onSuccess: () => {
      navigate("/teste");
    },
    onError: (error) => {
      console.log("Erro ao excluir:", error);
    }
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
      <div className="p-8 flex flex-col items-center">
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
    return (<div className="flex flex-col justify-items-center">
      <p className="p-8 text-red-500">Erro ao carregar heróis: {error.message}</p>
    </div>);
  }
  const dados = data.data || data
  return (<div className="p-5 ">
    <Link to="/teste">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Voltar
      </button>
    </Link>
    <div className="flex flex-col items-center p-3">

      <div className="border-4 border-indigo-500">
        <img src={dados.imagem} alt={dados.nome} />
      </div>
      <div className="text-cyan-50 flex flex-col justify-items-center">
        <h1 className="text-2xl font-bold">{dados.nome}</h1>
        <div className="flex justify-items-center gap-5">
          <div className="">
            <p>{dados.classe}</p>
            <p>Nível: {dados.nivel}</p>
            <p>Status: {dados.status}</p>
            <p>XP: {dados.xps}/{dados.pontos_xps}</p>
          </div>
          <div className="">
            <p>Rank: {dados.nome_rank}</p>
            <p>Ouro: {dados.ouro}</p>
            <p>Nível: {dados.nivel}</p>
            <p>Titulo: {dados.titulos}</p>
          </div>
        </div>
      </div>
      <button
        onClick={handleDelete}
        disabled={excluirHeroi.isPending}
        className="bg-red-600 hover:bg-red-800 disabled:opacity-50 text-white font-bold py-2 px-4 rounded ml-3"
      >
        {excluirHeroi.isPending ? "Excluindo..." : "Excluir Herói"}
      </button>
    </div>

  </div>
  )
}

export default Heroi;