import { useState } from "react";
import { z } from 'zod';

const schema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  classe: z.string().min(4, "classe muito curto"),
})

function Formulario(){
    const [dados, setDados] = useState ({
        nome: '',
        classe: ''
    });
    const [erros, setErros] = useState({});
    

    function handleChange(e) {
    setDados({
      ...dados,[e.target.name]: e.target.value
    })
  }

    
    function handleSubmit(e) {
    e.preventDefault();

    const result = schema.safeParse(dados);
    if (!result.success) {
      setErros(result.error.format());
    } else {
      setErros({})
      alert("Formulário enviado com sucesso!")
    }
  }
    return(<>
    <form
  onSubmit={handleSubmit}
  className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-5"
>
  <div className="flex flex-col">
    <label htmlFor="nome" className="text-sm font-semibold text-gray-700 mb-1">
      Nome
    </label>

    <input
      type="text"
      name="nome"
      onChange={handleChange}
      className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
      placeholder="Digite o nome"
    />

    {erros.nome && (
      <p className="text-red-500 text-sm mt-1">
        {erros.nome._errors}
      </p>
    )}
  </div>

  <div className="flex flex-col">
    <label htmlFor="classe" className="text-sm font-semibold text-gray-700 mb-1">
      Classe
    </label>

    <input
      type="text"
      name="classe"
      onChange={handleChange}
      className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
      placeholder="Digite a classe"
    />

    {erros.classe && (
      <p className="text-red-500 text-sm mt-1">
        {erros.classe._errors}
      </p>
    )}
  </div>

  {/* Botão */}
  <button
    type="submit"
    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition duration-200 shadow-sm"
  >
    Enviar
  </button>
</form>
    <div>

    </div>
    </>)
}

export default Formulario;