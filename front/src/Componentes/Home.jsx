import { useQuery } from '@tanstack/react-query';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cards from "./Cards";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if (!token) {
      navigate('/acesso-negado');
    }
  }, [token, navigate]);
  
  const {data, isLoading, error} = useQuery({
    queryKey: ['herois'],
    queryFn: async () => {
        const res = await axios.get('http://localhost:418/herois', {
            headers: { authorization: `Bearer ${token}` }
        });
        return res.data;
    },
    enabled: !!token
  });

  if (isLoading){
    return(
     <div className="p-8 flex flex-col items-center bg-gradient-to-br from-slate-900 to-purple-900 h-[93%]">
      <img src="https://i.postimg.cc/FsymPshK/loading.png" alt="icone de caregando" className={isLoading ? "animate-spin" : ""}/>
      <p>Carregando...</p></div>
    )};
  
  if (error) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      localStorage.removeItem('token');
      navigate('/acesso-negado');
      return null;
    }
    return <div className="p-8 text-red-500">Erro ao carregar heróis: {error.message}</div>;
  }

    return (
        <div className="flex flex-col justify-items-center bg-gradient-to-br from-slate-900 to-purple-900 h-[93%]">
            <div className="flex justify-evenly">
                <div className=""><p>Total de Heróis Recrutados</p></div>
                <div className=""><p>Média de Poder da Equipe</p></div>
                <div className=""><p>Guilda Mais Forte</p></div>
            </div>
            <div className="grid grid-cols-5 gap-5 p-5">
                {data?.map((heroi) => (
                    <Cards key={heroi.id_heroi} heroi={heroi} />
                ))}
            </div>
        </div>
    );
}

export default Home