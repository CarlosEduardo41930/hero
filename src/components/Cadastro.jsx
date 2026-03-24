import { useState } from "react";


function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleCadastro = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem("Usuário cadastrado com sucesso!");
        // limpar os campos
        setNome("");
        setEmail("");
        setSenha("");
      } else {
        setMensagem("Erro: " + data.erro);
      }
    } catch (error) {
      setMensagem("Erro: ao conectar com o servidor!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">

        <h2 className="text-2xl font-bold text-center text-gray-800">
          Cadastro
        </h2>

        <form className="space-y-4" onSubmit={handleCadastro}>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>

            <input
              type="text"
              required
              placeholder="digite seu nome aqui"
              className="w-full px-3 py-2 mt-1 border rounded-md"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              required
              placeholder="digite seu email aqui"
              className="w-full px-3 py-2 mt-1 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha
            </label>

            <input
              type="password"
              required
              placeholder="digite sua senha aqui"
              className="w-full px-3 py-2 mt-1 border rounded-md"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="text-white bg-green-600 py-2 w-full rounded-md hover:bg-green-700 transition-colors"
          >
            Cadastrar
          </button>

        </form>

        {mensagem && (
          <p className="text-center text-sm text-blue-600">
            {mensagem}
          </p>
        )}

      </div>
    </div>
  );
}

export default Cadastro;