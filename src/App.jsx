import { useState } from "react";
import Card from "./components/Card";
import Texte from "./components/Texte";
// import Login from "./components/Login";
// import Cadastro from "./components/Cadastro";
import Formulario from "./components/Formulario";

import arqueira from "./assets/avatar/arqueira.png";
import guerreiro from "./assets/avatar/guerreiro.png";
import mage from "./assets/avatar/mage.png";
function App() {
  const listaHerois = [
    {
      id: 1,
      nome: "Arthemis",
      classe: "Arqueira",
      imagem: arqueira,
      status: "online",
    },
    {
      id: 2,
      nome: "Grog",
      classe: "Guerreiro",
      imagem: guerreiro,
      status: "ausente",
    },
    {
      id: 3,
      nome: "Elora",
      classe: "Maga",
      imagem: mage,
      status: "offline",
    },
    {
      id: 4,
      nome: "Arthemis",
      classe: "Arqueira",
      imagem: arqueira,
      status: "online",
    },
    {
      id: 5,
      nome: "Grog",
      classe: "Guerreiro",
      imagem: guerreiro,
      status: "ausente",
    },
    {
      id: 6,
      nome: "Elora",
      classe: "Maga",
      imagem: mage,
      status: "offline",
    },
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

  const [lista, setLista] = useState(novaLista);

  

  const filterMaga = () => {
    const maga = novaLista.filter((heroi) => {
      return heroi.classe === "Maga";
    });

    setLista(maga);
  };

  const filterGuerreiro = () => {
    const Guerreiro = novaLista.filter((heroi) => {
      return heroi.classe === "Guerreiro";
    });
    setLista(Guerreiro);
  };

  const filterArqueira = () => {
    const Arqueira = novaLista.filter((heroi) => {
      return heroi.classe === "Arqueira";
    });
    setLista(Arqueira);
  };

  

  const exibir = (id) => {
    const limpo = lista.map((heroi) => {
      if (heroi.id === id) {
        return { ...heroi, aparecer: false };
      }
      return heroi;
    });
    setLista(limpo);
  };

  const xps = (id) => {
    const contar = lista.map((heroi) => {
      if (heroi.id === id) {
        const xpNovo = heroi.xp + 50;
        if (xpNovo >= 100) {
          const nivel = (heroi.nivel += 1);
          return { ...heroi, xp: 0, nivel: nivel };
        } else {
          return { ...heroi, xp: xpNovo };
        }
      }
      return heroi;
    });
    setLista(contar);
  };


  return (
    <>
      {/* <div style={containerStyle}>
          {lista.filter((heroi)=>{return heroi.aparecer === true}).map((heroi)=>{return <Card  key={heroi.id} heroi={heroi} exibir={()=> exibir(heroi.id)}/>})}
        </div> */}

      <div style={{ textAlign: "center" }}>
        <button
          className="w-1/5 mt-3 py-2 text-white rounded-md hover:bg-blue-700 transition-colors bg-blue-600"
          onClick={filterMaga}
        >
          Recrutar Maga
        </button>
        <button
          className="w-1/5 mt-3 py-2 text-white rounded-md hover:bg-blue-700 transition-colors bg-yellow-700"
          onClick={filterGuerreiro}
        >
          Recrutar Guerreiro
        </button>
        <button
          className="w-1/5 mt-3 py-2 text-white rounded-md hover:bg-blue-700 transition-colors bg-green-700"
          onClick={filterArqueira}
        >
          Recrutar Arqueira
        </button>
        <h1>Seleção de Heróis</h1>
      </div>
      <div></div>
      <div className="flex flex-col justify-center text-center ">
        <h1>Recrute seu time</h1>
        <div>
          <h2 className="flex flex-col my-8">Maga</h2>
          <div style={containerStyle}>
            {lista
              .filter((heroi) => {
                return heroi.classe === "Maga";
              })
              .filter((heroi) => {
                return heroi.aparecer === true;
              })
              .map((heroi) => {
                return (
                  <Card
                    key={heroi.id}
                    heroi={heroi}
                    exibir={() => exibir(heroi.id)}
                    xps={() => xps(heroi.id)}
                  />
                );
              })}
          </div>
        </div>
        <div className="">
          <h2>Guerreiro</h2>
          <div style={containerStyle}>
            {lista
              .filter((heroi) => {
                return heroi.classe === "Guerreiro";
              })
              .filter((heroi) => {
                return heroi.aparecer === true;
              })
              .map((heroi) => {
                return (
                  <Card
                    key={heroi.id}
                    heroi={heroi}
                    exibir={() => exibir(heroi.id)}
                    xps={() => xps(heroi.id)}
                  />
                );
              })}
          </div>
        </div>
        <div>
          <h2>Arqueira</h2>
          <div style={containerStyle}>
            {lista
              .filter((heroi) => {
                return heroi.classe === "Arqueira";
              })
              .filter((heroi) => {
                return heroi.aparecer === true;
              })
              .map((heroi) => {
                return (
                  <Card
                    key={heroi.id}
                    heroi={heroi}
                    exibir={() => exibir(heroi.id)}
                    xps={() => xps(heroi.id)}
                  />
                );
              })}
          </div>
        </div>
      </div>
      <Formulario />

      {/* <Cadastro /> */}
    </>
  );
}

export default App;
