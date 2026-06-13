import Cards from "./Cards";

function Home() {
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

    return (
        <div className="flex flex-col justify-items-center">
            <div className="flex justify-evenly">
                <div className="">
                    <p>Total de Heróis Recrutados</p>
                </div>
                <div className="">
                    <p>Média de Poder da Equipe</p>
                </div>
                <div className="">
                    <p>Guilda Mais Forte</p>
                </div>

            </div>
            <div className="flex justify-around pt-5">
                {listaHerois.map((heroi) => (
                    <Cards key={heroi.id} heroi={heroi} />
                ))}
            </div>
        </div>
    );
}

export default Home