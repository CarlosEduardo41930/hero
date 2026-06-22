import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiMostrarGuildas } from "../api/apisRotas";
import CardGuilda from "./CardGuilda";

function Guildas() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/acesso-negado");
        }
    }, [token, navigate]);

    const { data, isLoading, error } = useQuery({
        queryKey: ["guildas"],
        queryFn: apiMostrarGuildas,
        enabled: !!token,
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
                
                <p>Erro ao carregar guildas.</p>
            </div>
        );
    }

    const guildas = data?.data ?? [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900">

            <div className="flex justify-between items-center p-6">
                <h1 className="text-4xl text-white font-bold">
                    Guildas
                </h1>

                <button
                    onClick={() => navigate("/guildas/novo")}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                >
                    + Nova Guilda
                </button>
            </div>

            <div className="grid grid-cols-4 gap-5 p-5">
                {data?.status === 204 || guildas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] col-span-4">
                        <img
                            src="https://i.postimg.cc/5NwXWbZT/guilda.png"
                            alt="guilda"
                            className="w-64 opacity-70"
                        />

                        <p className="mt-4 text-gray-400 text-xl font-semibold">
                            Nenhuma guilda cadastrada
                        </p>

                        <button
                            onClick={() => navigate("/guildas/novo")}
                            className="mt-5 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
                        >
                            Criar primeira guilda
                        </button>
                    </div>
                ) : (
                    guildas.map((guilda) => (
                        <CardGuilda
                            key={guilda.id_guilda}
                            guilda={guilda}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default Guildas;