import { z } from 'zod';
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiBuscarPerfil, apiAtualizarPerfil } from "../api/apisRotas";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Perfil() {
    const [nome_completo, setNomeCompleto] = useState('');
    const [nome_usuario, setNomeUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [atualSenha, setAtualSenha] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erro, setErro] = useState([]);
    const [sucesso, setSucesso] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/acesso-negado');
        }
    }, [token, navigate]);

    const validacaoPerfil = z.object({
        nome_completo: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
        nome_usuario: z.string().min(3, "O usuário deve ter pelo menos 3 caracteres"),
        email: z.string().email("E-mail inválido"),
        atualSenha: z.string(),
        novaSenha: z.string(),
        confirmarSenha: z.string(),
    }).refine((dados) => {
        if (dados.novaSenha) {
            return dados.novaSenha === dados.confirmarSenha;
        }
        return true;
    }, {
        message: "A nova senha e a confirmação não coincidem",
        path: ["confirmarSenha"]
    });

    const mutation = useMutation({
        mutationFn: apiAtualizarPerfil,
        onSuccess: (dado) => {
            console.log('Perfil atualizado com sucesso:', dado.data);
            setSucesso('Perfil atualizado com sucesso!');
            setNovaSenha('');
            setConfirmarSenha('');
            setErro([]);
        },
        onError: (error) => {
            const data = error.response?.data;
            console.log('Erro na atualização:', data);
            const mensagens = [
                data?.message || data?.error,
                ...(data?.errors?.map(err => err.message) || [])
            ].filter(Boolean);

            setErro(mensagens);
            setSucesso('');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setErro([]);
        setSucesso('');

        const dadosValidos = validacaoPerfil.safeParse({
            nome_completo,
            nome_usuario,
            email,
            atualSenha,
            novaSenha,
            confirmarSenha
        });

        if (dadosValidos.success) {
            mutation.mutate(dadosValidos.data);
        } else {
            console.error('Dados de perfil inválidos:', dadosValidos.error.flatten());
            setErro((antes) => [
                ...new Set([
                    ...antes,
                    ...Object.values(dadosValidos.error.flatten().fieldErrors).flat()
                ])
            ]);
        }
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['perfil'],
        queryFn: apiBuscarPerfil,
        enabled: !!token
    });

    useEffect(() => {
    if (data?.data?.rows?.length > 0) {
        const usuario = data.data.rows[0];

        setEmail(usuario.email || '');
        setNomeCompleto(usuario.nome || '');
        setNomeUsuario(usuario.nome_usuario || '');
    }
}, [data]);

    if (isLoading) {
        return (
            <div className="p-8 flex flex-col items-center bg-gradient-to-br from-slate-900 to-purple-900 h-[93%] text-white">
                <img src="https://i.postimg.cc/FsymPshK/loading.png" alt="icone de caregando" className={isLoading ? "animate-spin" : ""} />
                <p>Carregando...</p>
            </div>
        );
    }

    if (error) {
        return <div className="p-8 text-red-500 bg-slate-900 h-full"><p>Erro ao carregar perfil: {error.message}</p></div>;
    }

    return (
        <div className="p-8 bg-gradient-to-br from-slate-900 to-purple-900 min-h-[93%] text-white flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6">Perfil</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white/10 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md">

                {sucesso && <div className="mb-4 p-3 bg-green-500/30 border border-green-500 text-green-200 rounded-lg text-sm">{sucesso}</div>}
                {erro.length > 0 && (
                    <div className="mb-4 p-3 bg-red-500/30 border border-red-500 text-red-200 rounded-lg text-sm">
                        {erro.map((err, i) => <p key={i}>• {err}</p>)}
                    </div>
                )}

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-purple-300">Editar Informação:</h2>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-white">Nome Completo:</label>
                        <input
                            type="text"
                            value={nome_completo}
                            onChange={(e) => setNomeCompleto(e.target.value)}
                            className="w-full rounded-lg border border-white/20 bg-white/20 px-4 py-2 text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-white">Nome de Usuário:</label>
                        <input
                            type="text"
                            value={nome_usuario}
                            onChange={(e) => setNomeUsuario(e.target.value)}
                            className="w-full rounded-lg border border-white/20 bg-white/20 px-4 py-2 text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-white">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-white/20 bg-white/20 px-4 py-2 text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
                            required
                        />
                    </div>
                </div>

                <hr className="border-white/10 mb-6" />

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-purple-300">Nova Senha:</h2>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-white">Senha Atual:</label>
                        <input
                            type="password"
                            value={atualSenha}
                            onChange={(e) => setAtualSenha(e.target.value)}
                            className="w-full rounded-lg border border-white/20 bg-white/20 px-4 py-2 text-white focus:border-purple-400 focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-white">Nova Senha:</label>
                        <input
                            type="password"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            className="w-full rounded-lg border border-white/20 bg-white/20 px-4 py-2 text-white focus:border-purple-400 focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-white">Confirmar Nova Senha:</label>
                        <input
                            type="password"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            className="w-full rounded-lg border border-white/20 bg-white/20 px-4 py-2 text-white focus:border-purple-400 focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 transition font-medium text-white shadow-lg disabled:opacity-50"
                >
                    {mutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </form>
        </div>
    );
}

export default Perfil;