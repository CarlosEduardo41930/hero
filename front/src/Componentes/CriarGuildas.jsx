import { z } from 'zod';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiAdicionarGuilda } from '../api/apisRotas';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function CriarGuildas() {
    const [nome, setNome] = useState('');
    const [ouro, setOuro] = useState('');
    const [especializacao, setEspecializacao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [erro, setErro] = useState([]);
    const navigate = useNavigate();

    const validacaoGuilda = z.object({
        nome: z.string().min(2, 'O nome da guilda deve ter pelo menos 2 caracteres').max(100),
        ouro: z.coerce.number().min(0),
        especializacao: z.string().max(100).optional(),
        descricao: z.string().max(1000).optional(),
    });

    const mutation = useMutation({
        mutationFn: apiAdicionarGuilda,
        onSuccess: () => navigate('/guildas'),
        onError: (error) => {
            const data = error.response?.data;
            const mensagens = [
                data?.message || data?.error,
                ...(data?.errors?.map(err => err.message) || [])
            ].filter(Boolean);
            setErro(mensagens);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setErro([]);
        const dadosValidos = validacaoGuilda.safeParse({ nome, ouro, especializacao, descricao });
        if (dadosValidos.success) {
            mutation.mutate(dadosValidos.data);
        } else {
            setErro(Object.values(dadosValidos.error.flatten().fieldErrors).flat());
        }
    };

    const inputClass = "w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 focus:outline-none transition";
    const labelClass = "mb-1.5 block text-sm font-medium text-purple-300";

    return (
        <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-6">
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white/10 p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">Criar Guilda</h1>

                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>Nome da Guilda *</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da guilda..." className={inputClass} required />
                    </div>

                    <div>
                        <label className={labelClass}>Ouro</label>
                        <input type="number" value={ouro} onChange={(e) => setOuro(e.target.value)} placeholder="0" className={inputClass} />
                    </div>

                    <div>
                        <label className={labelClass}>Especialização</label>
                        <input type="text" value={especializacao} onChange={(e) => setEspecializacao(e.target.value)} placeholder="Ex: Combate, Comércio..." className={inputClass} />
                    </div>

                    <div>
                        <label className={labelClass}>Descrição</label>
                        <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva sua guilda..." className={`${inputClass} resize-none h-24`} />
                    </div>
                </div>

                <button type="submit" disabled={mutation.isPending}
                    className="w-full mt-6 rounded-lg bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100">
                    {mutation.isPending ? 'Cadastrando...' : 'Criar Guilda'}
                </button>

                <AnimatePresence>
                    {erro.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="mt-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg"
                        >
                            {erro.map((msg, i) => (
                                <p key={i} className="text-red-300 text-sm text-center">{msg}</p>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </div>
    );
}

export default CriarGuildas;