import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { apiLogin } from "../api/apisRotas"
import { motion, AnimatePresence } from 'framer-motion';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: apiLogin,
        onSuccess: (dado) => {
            localStorage.setItem('token', dado.data.token);
            localStorage.setItem('usuario', dado.data.dados);
            navigate('/');
        }
    })
    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({ email, senha: password });
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
            <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl bg-white/10 p-8 backdrop-blur-md">
                <h2 className="mb-6 text-center text-3xl font-bold text-white">Login</h2>
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
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full rounded-lg bg-purple-600 py-2 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
                >
                    {mutation.isPending ? 'Entrando...' : 'Login'}
                </button>
                <AnimatePresence>
                    {mutation.error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="mt-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg"
                        >
                            <p className="text-center text-red-300 text-sm">
                                {mutation.error?.response?.data?.message || 'Tente novamente'}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
                <p className="text-center text-sm text-white pt-4">
                    Não é cadastrado? <Link to="/cadastro" className="text-purple-400 hover:text-purple-300">Crie uma conta aqui</Link>
                </p>
            </form>
        </div>
    );
}

export default Login
