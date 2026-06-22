import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiMissoes, apiFecharMissao } from "../api/apisRotas";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Missoes() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [menuAberto, setMenuAberto] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["missoes"],
    queryFn: apiMissoes
  });


  const fecharMissao = useMutation({
    mutationFn: (id) => apiFecharMissao(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["missoes"]);
    },
    onError: (error) => {
      alert(
        error.response?.data?.erro ||
        error.response?.data?.message ||
        "Erro ao fechar missão"
      );
    }
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
    if (error.response?.status === 401 || error.response?.status === 403) {
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

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-900 to-purple-900">


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
          <div className="flex flex-col items-center justify-center min-h-[60vh] col-span-4">
            <img
              src="https://i.postimg.cc/fRFM9TWp/negado.png"
              alt="sem missões"
              className="w-64 opacity-70"
            />

            <p className="mt-4 text-gray-400 text-xl font-semibold">
              Sem missões cadastradas
            </p>
          </div>
        ) : (
          lista.map((m) => (
            <div
              key={m.id_missao}
              className="bg-gray-200 p-4 rounded relative"
            >
              <button
                onClick={() =>
                  setMenuAberto(menuAberto === m.id_missao ? null : m.id_missao)
                }
                className="absolute top-2 right-2 text-xl font-bold"
              >
                ⋮
              </button>

              {menuAberto === m.id_missao && (
                <div className="absolute top-8 right-2 bg-white shadow-lg rounded-xl p-4 w-48 z-10 border border-gray-200">

                  <button
                    onClick={() => setMenuAberto(null)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
                  >
                    ✕
                  </button>

                  <div className="mt-6 flex flex-col gap-2">

                    <button
                      className="text-left px-2 py-2 rounded hover:bg-green-100 text-green-600 font-medium"
                      onClick={() => {
                        fecharMissao.mutate(m.id_missao);
                        setMenuAberto(null);
                      }}
                    >
                      Fechar Missão
                    </button>

                  </div>
                </div>
              )}
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