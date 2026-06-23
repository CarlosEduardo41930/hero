import { z } from 'zod';
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiGuildas, apiAdicionarHeroi } from '../api/apisRotas';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';

function CriarHeroi() {
    const [nome, setNome] = useState('');
    const [classe, setClasse] = useState('');
    const [imagem, setImagem] = useState('');
    const [nivel, setNivel] = useState('');
    const [status, setStatus] = useState('');
    const [guilda, setGuilda] = useState('');
    const [ouro, setOuro] = useState('');
    const [descricao, setDescricao] = useState('');
    const [erro, setErro] = useState([]);
    const navigate = useNavigate();

    const validacaoHeroi = z.object({
        nome: z.coerce.string().min(2, "O nome completo deve ter pelo menos 2 caracteres"),
        classe: z.enum(["guerreiro", "mago", "ladino", "clérigo", "paladino", "bárbaro", "ranger", "bardo", "feiticeiro", "monge"]),
        nivel: z.coerce.number().min(1, "Nivel mínimo é 1").max(300, "Nivel máxima é 300"),
        status: z.enum(["online", "ausente", "offline"]),
        imagem: z.string().url("Insira uma URL válida"),
        guilda: z.coerce.number(),
        ouro: z.coerce.number(),
        descricao: z.coerce.string().max(255, "A descrição deve ter no máximo 255 caracteres")
    })

    const mutation = useMutation({
        mutationFn: apiAdicionarHeroi,
        onSuccess: (dado) => {
            navigate('/');
        },
        onError: (error) => {
            const data = error.response?.data;
            const mensagens = [
                data?.message || data?.error,
                ...(data?.errors?.map(err => err.message) || [])
            ].filter(Boolean);
            setErro(mensagens);
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        setErro([]);
        const dadosValidos = validacaoHeroi.safeParse({ nome, guilda, classe, imagem, nivel, status, ouro, descricao });
        if (dadosValidos.success) {
            mutation.mutate(dadosValidos.data)
        } else {
            setErro(Object.values(dadosValidos.error.flatten().fieldErrors).flat());
        }
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ['guildas'],
        queryFn: apiGuildas,
    })

    const listaGuildas = data?.data?.rows || data?.data || [];

    const inputClass = "w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 focus:outline-none transition";
    const labelClass = "mb-1.5 block text-sm font-medium text-purple-300";
    const selectClass = "w-full rounded-lg border border-white/20 bg-slate-800 px-4 py-2.5 text-white focus:border-purple-400 focus:ring-1 focus:ring-purple-400 focus:outline-none transition";

    return (
        <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-6">
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white/10 p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">Criar Herói</h1>

                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>Nome do Herói *</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome épico..." className={inputClass} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Classe *</label>
                            <select value={classe} onChange={(e) => setClasse(e.target.value)} className={selectClass} required>
                                <option value="">Escolher...</option>
                                <option value="guerreiro">Guerreiro</option>
                                <option value="mago">Mago</option>
                                <option value="ladino">Ladino</option>
                                <option value="clérigo">Clérigo</option>
                                <option value="paladino">Paladino</option>
                                <option value="bárbaro">Bárbaro</option>
                                <option value="ranger">Ranger</option>
                                <option value="bardo">Bardo</option>
                                <option value="feiticeiro">Feiticeiro</option>
                                <option value="monge">Monge</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Status *</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass} required>
                                <option value="">Escolher...</option>
                                <option value="online">Online</option>
                                <option value="ausente">Ausente</option>
                                <option value="offline">Offline</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Imagem (URL) *</label>
                        <input type="url" value={imagem} onChange={(e) => setImagem(e.target.value)} placeholder="https://..." className={inputClass} required />
                    </div>

                    <div>
                        <label className={labelClass}>Guilda *</label>
                        <select value={guilda} onChange={(e) => setGuilda(e.target.value)} className={selectClass} required>
                            {isLoading ? (
                                <option>Carregando...</option>
                            ) : error ? (
                                <option>Erro ao carregar</option>
                            ) : data?.status === 204 ? (
                                <option>Nenhuma guilda cadastrada</option>
                            ) : (
                                <>
                                    <option value="">Escolher guilda...</option>
                                    {listaGuildas.map((g) => (
                                        <option key={g.id_guilda} value={g.id_guilda}>{g.nome}</option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Nível *</label>
                            <input type="number" value={nivel} onChange={(e) => setNivel(e.target.value)} placeholder="1" className={inputClass} required />
                        </div>
                        <div>
                            <label className={labelClass}>Ouro</label>
                            <input type="number" value={ouro} onChange={(e) => setOuro(e.target.value)} placeholder="0" className={inputClass} />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Descrição *</label>
                        <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva seu herói..." className={`${inputClass} resize-none h-24`} required />
                    </div>
                </div>

                <button type="submit" disabled={mutation.isPending}
                    className="w-full mt-6 rounded-lg bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100">
                    {mutation.isPending ? 'Cadastrando...' : 'Cadastrar Herói'}
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
    )
}

export default CriarHeroi