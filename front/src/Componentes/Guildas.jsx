import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiMostrarGuildas } from "../api/apisRotas";
import CardGuilda from "./CardGuilda";

function Guildas() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) navigate("/acesso-negado");
    }, [token, navigate]);

    const { data, isLoading, error } = useQuery({
        queryKey: ["guildas"],
        queryFn: apiMostrarGuildas,
        enabled: !!token,
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
                <p className="text-red-400">Erro ao carregar guildas.</p>
            </div>
        );
    }

    const guildas = Array.isArray(data?.data) ? data.data : [];

    return (
        <div className="min-h-[calc(100vh-72px)] p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl text-white font-bold">Guildas</h1>
                <button
                    onClick={() => navigate("/guildas/novo")}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg transition hover:scale-[1.02] active:scale-[0.98]"
                >
                    + Nova Guilda
                </button>
            </div>

            {data?.status === 204 || guildas.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                    <p className="text-gray-400 text-xl font-semibold">Nenhuma guilda cadastrada</p>
                    <button
                        onClick={() => navigate("/guildas/novo")}
                        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition"
                    >
                        Criar primeira guilda
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {guildas.map((guilda) => (
                        <CardGuilda key={guilda.id_guilda} guilda={guilda} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Guildas;