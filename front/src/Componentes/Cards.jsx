import { Link } from "react-router-dom";
function Cards({ heroi }) {
  const statusColors = {
    online: "bg-green-500",
    ausente: "bg-yellow-500",
    offline: "bg-gray-500"
  };

  return (
    <Link to={`/heroi/${heroi.id_heroi}`}>
      

<div className="bg-gray-300 rounded-lg shadow-md p-4 w-48">
      <img
        src={heroi.imagem}
        alt={heroi.nome}
        className="w-full h-32 object-cover rounded-md mb-2"
      />
      <h3 className="font-bold text-lg">{heroi.nome}</h3>
      <p className="text-xs text-[20px]" style={{ color: heroi.cor}}>
        {heroi.nome_rank || 'Sem rank'}
      </p>
      <p className="text-gray-600">{heroi.classe}</p>
      <p className="text-sm text-gray-500">{heroi.nivel}</p>
      <p className="text-xs text-gray-400">{heroi.xp ?? heroi.pontos_xps}</p>
      <p className={`px-3 py-1 text-xs rounded-full font-semibold text-white ${
            statusColors[heroi.status] || "bg-gray-500"
          }`}>{heroi.status}</p>
      <p className="text-xs text-gray-400">{heroi.titulos || 'Sem título'}</p>
      
      <span
        className={`inline-block w-3 h-3 rounded-full ${statusColors[heroi.status] || 'bg-gray-500'}`}
      ></span>
    </div>
      </Link>    
  );
}
export default Cards;

