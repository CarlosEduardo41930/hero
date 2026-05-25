import { useState, useEffect } from "react";
import Card from "./components/Card";
import Formulario from "./components/Formulario";

import arqueira from "./assets/avatar/arqueira.png";
import guerreiro from "./assets/avatar/guerreiro.png";
import mage from "./assets/avatar/mage.png";

function App() {
  const listaHerois = [
    { id: 1, nome: "Arthemis", classe: "Arqueira", imagem: arqueira, status: "online" },
    { id: 2, nome: "Grog", classe: "Guerreiro", imagem: guerreiro, status: "ausente" },
    { id: 3, nome: "Elora", classe: "Maga", imagem: mage, status: "offline" },
    { id: 4, nome: "Arthemis", classe: "Arqueira", imagem: arqueira, status: "online" },
    { id: 5, nome: "Grog", classe: "Guerreiro", imagem: guerreiro, status: "ausente" },
    { id: 6, nome: "Elora", classe: "Maga", imagem: mage, status: "offline" },
  ];

  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    fontFamily: "sans-serif",
  };

  const novaLista = listaHerois.map((heroi) => ({
    ...heroi,
    aparecer: true,
    xp: 0,
    nivel: 0,
  }));

  const [lista, setLista] = useState(() => {
    const dadosSalvo = localStorage.getItem("herois");
    return dadosSalvo ? JSON.parse(dadosSalvo) : novaLista;
  });

  const [filtroClasse, setFiltroClasse] = useState("todos");

  useEffect(() => {
    localStorage.setItem("herois", JSON.stringify(lista));
    document.title = `Heróis Recrutados: ${lista.length}`;
  }, [lista]);

  const adicionarHeroi = (dados) => {
    setLista((antiga) => [
      ...antiga,
      { ...dados, id: lista.length + 1, imagem: "", status: "online", aparecer: true, nivel: 0, xp: 0 }
    ]);
  };

  const filtrarPorClasse = (classe) => setFiltroClasse(classe);

  const heroisFiltrados = lista.filter((heroi) => {
    if (filtroClasse === "todos") return heroi.aparecer === true;
    return heroi.classe === filtroClasse && heroi.aparecer === true;
  });

  const exibir = (id) => {
    setLista(lista.map((heroi) => heroi.id === id ? { ...heroi, aparecer: false } : heroi));
  };

  const xps = (id) => {
    setLista(lista.map((heroi) => {
      if (heroi.id === id) {
        const xpNovo = heroi.xp + 50;
        if (xpNovo >= 100) {
          return { ...heroi, xp: 0, nivel: heroi.nivel + 1 };
        }
        return { ...heroi, xp: xpNovo };
      }
      return heroi;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="text-center py-6 bg-gray-800 shadow-md">
        <h1 className="text-3xl font-bold text-white">Selecao de Herois</h1>
      </header>

      <nav className="flex justify-center gap-4 py-4 bg-gray-800">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => filtrarPorClasse("todos")}>
          Todos
        </button>
        <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700" onClick={() => filtrarPorClasse("Maga")}>
          Magas
        </button>
        <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700" onClick={() => filtrarPorClasse("Guerreiro")}>
          Guerreiros
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => filtrarPorClasse("Arqueira")}>
          Arqueiras
        </button>
      </nav>

      <main className="px-4 py-6">
        <div style={containerStyle}>
          {heroisFiltrados.length > 0 ? (
            heroisFiltrados.map((heroi) => (
              <Card key={heroi.id} heroi={heroi} exibir={() => exibir(heroi.id)} xps={() => xps(heroi.id)} />
            ))
          ) : (
            <p className="text-gray-400">Nenhum heroi disponivel</p>
          )}
        </div>
      </main>

      <Formulario adicionar={adicionarHeroi} />
    </div>
  );
}

export default App;