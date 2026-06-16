import { useParams,useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';


function Heroi() {
    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem('token');
    useEffect(() => {
    if (!token) {
      navigate('/acesso-negado');
    }
  }, [token, navigate]);

    const { data, isLoading, error } = useQuery({
    queryKey: ['personagem', id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:418/heroi/${id}`, {headers: { authorization: `Bearer ${token}` }})
      return res.data
    },
    enabled: !!token
  });

  if (isLoading){
    return(
     <div className="p-8 flex flex-col items-center">
      <img src="https://i.postimg.cc/FsymPshK/loading.png" alt="icone de caregando" className={isLoading ? "animate-spin" : ""}/>
      <p>Carregando...</p></div>
    )};
  
  if (error) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      localStorage.removeItem('token');
      navigate('/acesso-negado');
      return null;
    }
    return( <div className="flex flex-col justify-items-center">
        <p className="p-8 text-red-500">Erro ao carregar heróis: {error.message}</p>
        </div>);
  }
    return (<div className="p-5 ">
      <Link to="/teste">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Voltar
            </button>
        </Link>
      <div className="flex flex-col items-center p-3">
        
        <div className="border-4 border-indigo-500">
            <img src={data.imagem} alt={data.nome} />
        </div>
        <div className="text-cyan-50 flex flex-col justify-items-center">
            <h1 className="text-2xl font-bold">{data.nome}</h1>
            <div className="flex justify-items-center gap-5">
              <div className="">
                <p>{data.classe}</p>
            <p>Nível: {data.nivel}</p>
            <p>Status: {data.status}</p>
            <p>XP: {data.xps}/{data.pontos_xps}</p>
              </div>
              <div className="">
                <p>Rank: {data.nome_rank}</p>
                <p>Ouro: {data.ouro}</p>
            <p>Nível: {data.nivel}</p>
            <p>Titulo: {data.titulos}</p>
              </div>
            </div>
        </div>
    </div>
    </div>
    )
}

export default Heroi;