import StatusBadge from "./StatusBadge";


function Card({ heroi, exibir, xps}) {
  const chamado = () => {
    alert(`${heroi.nome} foi recrutado`);
  };

const subirDeNivel = heroi.xp === 0 && heroi.nivel > 0;


  const cardStyle = {
    borderRadius: "12px",
    padding: "16px",
    margin: "10px",
    boxShadow: "8 4px 8px rgba(0,8, 0.1)",
    textAlign: "center",
    width: "200px",
  };
  return (
    <div style={cardStyle} className={` ${subirDeNivel ? 'bg-yellow-600 border-4 border-yellow-800' : 'border-2 border-black-300  hover:bg-blue-100 active:bg-blue-300'}`}>
      <StatusBadge tipo={heroi.status} />
      <img
        src={heroi.imagem}
        alt={heroi.nome}
        style={{ width: "100%", borderRadius: "8px" }}
      />
      <h2>{heroi.nome}</h2>
      {subirDeNivel && <p className="text-yellow-200">Subiu de Nivel </p>}

      <p>Nivel: <span className="text-orange-800">{heroi.nivel}</span></p>
      <p>XP: <span className="text-green-700">{heroi.xp}</span></p>
      <p>classe: {heroi.classe}</p>
      <button className="w-full mt-3 py-2 text-white rounded-md hover:bg-blue-700 transition-colors bg-blue-600" onClick={chamado}>Recrutar</button>
      <button className="w-full mt-3 py-2 text-white rounded-md hover:bg-blue-700 transition-colors bg-orange-600" onClick={exibir}>Excluir</button>
      <button className="w-full mt-3 py-2 text-white rounded-md hover:bg-green-500 transition-colors bg-green-700" onClick={xps}>XP</button>
    </div>
  );
}
export default Card;


