import { useState } from "react";
import { z } from 'zod';

const schema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  classe: z.string().min(4, "Classe muito curta"),
})

function Formulario({ adicionar }) {
  const [dados, setDados] = useState({ nome: '', classe: '' });
  const [erros, setErros] = useState({});

  function handleChange(e) {
    setDados({ ...dados, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const result = schema.safeParse(dados);
    if (!result.success) {
      setErros(result.error.format());
    } else {
      setErros({});
      adicionar(dados);
      setDados({ nome: '', classe: '' });
      alert("Heroi recrutado com sucesso!");
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
          {erros.nome && <p className="text-red-400 text-xs mt-1">{erros.nome._errors}</p>}
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
          {erros.classe && <p className="text-red-400 text-xs mt-1">{erros.classe._errors}</p>}
        </div>

        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Enviar
        </button>
      </form>
    </section>
  );
}

export default Formulario;