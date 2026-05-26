import { useState } from 'react';

function Login() {
  const [ email, setEmail ] = useState("");
  const [ senha, setSenha ] = useState("");
  const [ mensagem, setMensagem ] = useState("");

  const handleLogin = async(e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify( { email, senha })
      });

      const data = await response.json();

      if(response.ok ) {
        setMensagem(`Bem vindo, ${data.usuario.nome}!`);
        // AQUI PODERIA SALVAR EM UM TOKEN
      } else {
        setMensagem(data.mensagem);
      }
    } catch (error) {
      setMensagem("Erro ao conectar com o Servidor!")
    }
  } 



  return(
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input type="email"
                   required
                  className="w-full px-3 py-2  mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label>
              Senha
            </label>
            <input 
                type="password" 
                required 
                className="w-full px-3 py-2  mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <button type="submit" className="text-white bg-blue-600 py-2 w-full rounded-md hover:bg-blue-700 transition-colors">Entrar</button>
        </form>

        {mensagem && (
          <p className={`text-center text-sm ${mensagem.includes("Bem-vindo") ? "text-green-600" : "text-red-600"}`}>
            {mensagem}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;