import { z } from 'zod';
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiGuildas, apiAdicionarHeroi } from '../api/apisRotas';
import { useNavigate } from "react-router-dom";


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
        classe: z.enum(["guerreiro", "mago", "ladino", "clérigo", "paladino", "bárbaro", "ranger", "bardo", "feiticeiro", "monge",]),
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
            console.log('Cadastro bem-sucedido:', dado.data);
            navigate('/teste');
        }, onError: (error) => {
            const data = error.response?.data;
            console.log('Erro no cadastro:', data);
            console.log(error.response?.data);
            console.log(error.response?.data?.errors);
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
            console.log(dadosValidos.error.issues);
            setErro(
                Object.values(dadosValidos.error.flatten().fieldErrors).flat()
            );
        }
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ['guildas'],
        queryFn: apiGuildas,
    })

    const listaGuildas = data?.data?.rows || data?.data || [];
    return (
        <div>


            <form onSubmit={handleSubmit} >
                <h1>Criar Herói</h1>
                <div>
                    <label >Nome do Heroi: *</label>
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    <label >Classe: </label>
                    <select value={classe} onChange={(e) => setClasse(e.target.value)} required>
                        <option value="">Escolha uma classe</option>
                        <option value="guerreiro">Guerreiro</option>
                        <option value="mago">Mago</option>
                        <option value="ladino">Ladino</option>
                        <option value="clérigo">Clérigo</option>
                        <option value="paladino">Paladino</option>
                        <option value="bárbaro">Bárbaro</option>
                        <option value="ranger">Ranger(Patrulheiro)</option>
                        <option value="bardo">Bardo</option>
                        <option value="feiticeiro">Feiticeiro</option>
                        <option value="monge">Monge</option>
                    </select>
                    <label>Imagem: *</label>
                    <input type="url" value={imagem} onChange={(e) => setImagem(e.target.value)} required />
                    <label>Nivel: *</label>
                    <input type="number" value={nivel} onChange={(e) => setNivel(e.target.value)} required />
                    <label>Status: </label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                        <option value="">Escolha um status</option>
                        <option value="online">Online</option>
                        <option value="ausente">Ausente</option>
                        <option value="offline">Offline</option>
                    </select>
                    <label >Guilda: *</label>
                    <select value={guilda} onChange={(e) => setGuilda(e.target.value)} required>

                        {isLoading ? (
                            <option>Carregando guildas...</option>
                        ) : error ? (
                            <option>Erro ao carregar guildas</option>
                        ) : data?.status === 204 ? (
                            <option>Não tem nenhuma Guilda cadastrada!</option>
                        ) : (
                            <>
                                <option value="">Qual guilda deseja ...</option>
                                {listaGuildas.map((guilda) => (
                                    <option key={guilda.id_guilda} value={guilda.id_guilda}>{guilda.nome}</option>
                                ))}
                            </>
                        )}
                    </select>
                    <label>Ouro: </label>
                    <input type="number" value={ouro} onChange={(e) => setOuro(e.target.value)} />
                    <label>Descricao: *</label>
                    <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required></textarea>
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
            </form>
        </div>
    )
}
export default CriarHeroi