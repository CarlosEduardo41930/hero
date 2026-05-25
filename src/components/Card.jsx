import StatusBadge from "./StatusBadge";

function Card({ heroi, exibir, xps }) {
  const chamado = () => {
    alert(`${heroi.nome} foi recrutado`);
  };

  const subirDeNivel = heroi.xp === 0 && heroi.nivel > 0;

  return (
    <div className="bg-gray-800 rounded-lg p-4 m-3 shadow-md border border-gray-700 hover:shadow-lg transition-shadow w-64">
      <StatusBadge tipo={heroi.status} />
      <img
        src={heroi.imagem}
        alt={heroi.nome}
        className="w-full rounded mb-3"
        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
      />
      <h2 className="text-lg font-bold text-white">{heroi.nome}</h2>
      {subirDeNivel && <p className="text-yellow-400 text-sm">Nivel completo!</p>}
      <div className="text-sm text-gray-300 mt-2">
        <p>Nivel: <span className="text-orange-400">{heroi.nivel}</span></p>
        <p>XP: <span className="text-green-400">{heroi.xp}/100</span></p>
        <p>Classe: <span className="text-purple-400">{heroi.classe}</span></p>
      </div>
      <div className="flex flex-col gap-2 mt-3">
        <button className="w-full py-1.5 text-white rounded bg-blue-600 hover:bg-blue-700" onClick={chamado}>
          Recrutar
        </button>
        <button className="w-full py-1.5 text-white rounded bg-red-600 hover:bg-red-700" onClick={exibir}>
          Excluir
        </button>
        <button className="w-full py-1.5 text-white rounded bg-green-600 hover:bg-green-700" onClick={xps}>
          + XP
        </button>
      </div>
    </div>
  );
}
export default Card;