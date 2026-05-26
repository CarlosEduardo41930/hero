import { useState } from "react";
import { useMutation } from '@tanstack/react-query';
import axios from "axios";
import { z } from 'zod';

const schema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  classe: z.string().nonempty("Selecione uma classe"),
  imagem: z.string().url("Digite uma URL válida"),
  status: z.enum(['online', 'ausente', 'offline']),
  nivel: z.number().int().min(0, "Nível deve ser 0 ou mais").max(100, "Nível deve ser 100 ou menos")
})

function Formulario({ adicionar }) {
  const [dados, setDados] = useState({ nome: '', classe: '', imagem: '', status: '', nivel: 0 });
  const [erros, setErros] = useState({});

  const adicionarHeroi = useMutation({
    mutationFn: async (novoHeroi) => {
      return axios.post('http://localhost:418/cadastrar', novoHeroi);
    },
    onSuccess: () => {
      adicionar(dados);
      setDados({ nome: '', classe: '', imagem: '', status: '', nivel: 0 });
      alert("Heroi recrutado com sucesso!");
    }
  })

  function handleChange(e) {
    const value = e.target.name === 'nivel' ? Number(e.target.value) : e.target.value;
    setDados({ ...dados, [e.target.name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const result = schema.safeParse(dados);
    if (!result.success) {
      setErros(result.error.format());
    } else {
      setErros({});
      adicionarHeroi.mutate(dados);
    }
  }

  return (
    <section className="max-w-md mx-auto mt-8 mb-6 bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-center text-white mb-4">Cadastrar Heroi</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={dados.nome}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nome do heroi"
          />
          {erros.nome && <p className="text-red-400 text-xs mt-1">{erros.nome._errors?.[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Classe</label>
          <select
            name="classe"
            value={dados.classe}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Selecione</option>
            <option value="Maga">Maga</option>
            <option value="Guerreiro">Guerreiro</option>
            <option value="Arqueira">Arqueira</option>
          </select>
          {erros.classe && <p className="text-red-400 text-xs mt-1">{erros.classe._errors?.[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Imagem</label>
          <input
            type="text"
            name="imagem"
            value={dados.imagem}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="URL da imagem"
          />
          {erros.imagem && <p className="text-red-400 text-xs mt-1">{erros.imagem._errors?.[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
          <select
            name="status"
            value={dados.status}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Selecione</option>
            <option value="online">Online</option>
            <option value="ausente">Ausente</option>
            <option value="offline">Offline</option>
          </select>
          {erros.status && <p className="text-red-400 text-xs mt-1">{erros.status._errors?.[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Nível</label>
          <input
            type="number"
            name="nivel"
            value={dados.nivel}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nível do herói"
          />
          {erros.nivel && <p className="text-red-400 text-xs mt-1">{erros.nivel._errors?.[0]}</p>}
        </div>

        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Enviar
        </button>
      </form>
    </section>
  );
}

export default Formulario;