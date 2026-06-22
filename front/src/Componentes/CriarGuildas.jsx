import { z } from 'zod';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiAdicionarGuilda } from '../api/apisRotas';
import { useNavigate } from 'react-router-dom';

function CriarGuildas() {
    const [nome, setNome] = useState('');
    const [ouro, setOuro] = useState('');
    const [especializacao, setEspecializacao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [erro, setErro] = useState([]);

    const navigate = useNavigate();

    const validacaoGuilda = z.object({
        nome: z.string()
            .min(2, 'O nome da guilda deve ter pelo menos 2 caracteres')
            .max(100, 'O nome da guilda deve ter no máximo 100 caracteres'),

        ouro: z.coerce.number().min(0),

        especializacao: z.string()
            .max(100, 'A especialização deve ter no máximo 100 caracteres')
            .optional(),

        descricao: z.string()
            .max(1000, 'A descrição é muito longa')
            .optional(),
    });

    const mutation = useMutation({
        mutationFn: apiAdicionarGuilda,

        onSuccess: (dado) => {
            console.log('Guilda criada:', dado.data);
            navigate('/guildas');
        },

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

        const dadosValidos = validacaoGuilda.safeParse({ nome, ouro, especializacao, descricao
        });

        if (dadosValidos.success) {
            mutation.mutate(dadosValidos.data);
        } else {
            setErro(
                Object.values(
                    dadosValidos.error.flatten().fieldErrors
                ).flat()
            );
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Criar Guilda</h1>

                <div>
                    <label>Nome da Guilda *</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />


                    <label>Ouro</label>
                    <input
                        type="number"
                        value={ouro}
                        onChange={(e) => setOuro(e.target.value)}
                    />

                    <label>Especialização</label>
                    <input
                        type="text"
                        value={especializacao}
                        onChange={(e) => setEspecializacao(e.target.value)}
                    />


                    <label>Descrição</label>
                    <textarea
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending
                        ? 'Cadastrando...'
                        : 'Cadastrar Guilda'}
                </button>

                {erro.length > 0 && (
                    <ul>
                        {erro.map((msg, i) => (
                            <li
                                key={i}
                                className="mt-4 text-center text-red-400 text-sm"
                            >
                                {msg}
                            </li>
                        ))}
                    </ul>
                )}
            </form>
        </div>
    );
}

export default CriarGuildas;