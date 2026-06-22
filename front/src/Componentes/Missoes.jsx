import { useQuery } from "@tanstack/react-query";
import { apiMissoes } from "../api/apisRotas";
import { useNavigate } from "react-router-dom";

function Missoes() {
    const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["missoes"],
    queryFn: apiMissoes
  });

  if (isLoading) {
        return (
            <div className="p-8 flex flex-col items-center bg-gradient-to-br from-slate-900 to-purple-900 h-screen">
                <img
                    src="https://i.postimg.cc/FsymPshK/loading.png"
                    alt="loading"
                    className="animate-spin"
                />
                <p>Carregando...</p>
            </div>
        );
    }

    if (error) {
        console.log(error);
        console.log(error.response?.data);
        if ( error.response?.status === 401 || error.response?.status === 403
        ) {
            localStorage.removeItem("token");
            navigate("/acesso-negado");
            return null;
        }

        return (
            <div className="text-red-500 p-8">
                
                <p>Erro ao carregar Missões.</p>
            </div>
        );
    }

  const lista = data?.data || [];

  return (<div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-900 to-purple-900">

      <div className="w-full flex justify-end p-4">
        <button
          onClick={() => navigate("/missoes/novo")}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          + Criar Missão
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 w-full">

        {lista.length === 0 ? (
          <p className="text-white col-span-3 text-center">
            Sem missões cadastradas
          </p>
        ) : (
          lista.map((m) => (
            <div key={m.id_missao} className="bg-gray-200 p-4 rounded">
              <h2 className="font-bold">{m.nome}</h2>
              <p>Tipo: {m.tipo}</p>
              <p>Local: {m.local_missao}</p>
              <p>Nível: {m.nivel}</p>
              <p>Pontos: {m.pontos}</p>
              <p>Recompensa: {m.recompensa}</p>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default Missoes;