import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { apiCadastrar } from '../api/apisRotas';
import { z } from 'zod';

function Cadastro() {
    const [nome_completo, setNomeCompleto] = useState('');
    const [nome_usuario, setNomeUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [erro, setErro] = useState([]);

    const validacaoCadastro = z.object({
        email: z.string().email(),
        senha: z.string().min(6),
        confirmPassword: z.string(),
        nome_completo: z.string().min(2, "O nome completo deve ter pelo menos 2 caracteres").max(100, "O nome completo deve ter no máximo 100 caracteres"),
        nome_usuario: z.string().min(2, "O nome de usuário deve ter pelo menos 2 caracteres").max(50, "O nome de usuário deve ter no máximo 50 caracteres")
    }).refine((data) => data.senha === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    });

    const mutation = useMutation({
        mutationFn: apiCadastrar,
        onSuccess: (dado) => {
            console.log('Cadastro bem-sucedido:', dado.data);
            localStorage.setItem('token', dado.data.token);
            navigate('/teste');
        }, onError: (error) => {
            const data = error.response?.data;
            console.log('Erro no cadastro:', data);
            const mensagens = [
                data?.message,
                ...(data?.errors?.map(err => err.message) || [])
            ].filter(Boolean);

            setErro(mensagens);
        }
    })
    const handleSubmit = (e) => {
        e.preventDefault();
        setErro([]);

        const dadosValidos = validacaoCadastro.safeParse({ nome_completo, nome_usuario, email, senha: password, confirmPassword });
        if (dadosValidos.success) {
            mutation.mutate(dadosValidos.data);
        } else {
            console.error('Dados de cadastro inválidos:', dadosValidos.error.flatten());
            setErro((antes) => [
                ...new Set([
                    ...antes,
                    ...Object.values(dadosValidos.error.flatten().fieldErrors).flat()
                ])
            ]);
            console.log(dadosValidos.error.flatten().fieldErrors.confirmPassword);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
            <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl bg-white/10 p-8 backdrop-blur-md">
                <h2 className="mb-6 text-center text-3xl font-bold text-white">Cadastro</h2>
                <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-white">Nome Completo:</label>
                    <input
                        type="text"
                        value={nome_completo}
                        onChange={(e) => setNomeCompleto(e.target.value)}
                        className="w-full rounded-lg border border-white/20 bg-white/20 px-4 py-2 text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
                        placeholder="seu@email.com"
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
                        placeholder="seu@email.com"
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
                        placeholder="seu@email.com"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-white">Senha:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-white/20 bg-white/20 px-4 py-2 text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
                        placeholder="••••••••"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-white">Confirmar Senha:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-lg border border-white/20 bg-white/20 px-4 py-2 text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
                        placeholder="••••••••"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full rounded-lg bg-purple-600 py-2 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
                >
                    {mutation.isPending ? 'Cadastrando...' : 'Cadastrar'}
                </button>
                {erro.length > 0 && (
                    <ul>
                        {erro.map((msg, i) => (
                            <li key={i} className="mt-4 text-center text-red-400 text-sm">
                                {msg}
                            </li>
                        ))}
                    </ul>
                )}
                <p className="text-center text-sm text-white pt-4">
                    Já é cadastrado? <Link to="/login" className="text-purple-400 hover:text-purple-300">Faça login aqui</Link>
                </p>
            </form>
        </div>
    );
}

export default Cadastro
