import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Cards({ heroi }) {
  const statusColors = {
    online: "bg-green-500",
    ausente: "bg-yellow-500",
    offline: "bg-gray-500"
  };

  const statusText = {
    online: "Online",
    ausente: "Ausente",
    offline: "Offline"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03, y: -4 }}
    >
      <Link to={`/heroi/${heroi.id_heroi}`}>
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 p-4 w-52 hover:border-purple-400/40 transition-colors shadow-lg">
          <div className="relative mb-3">
            <img
              src={heroi.imagem}
              alt={heroi.nome}
              className="w-full h-36 object-cover rounded-lg"
            />
            <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs rounded-full font-semibold text-white ${statusColors[heroi.status] || "bg-gray-500"}`}>
              {statusText[heroi.status] || heroi.status}
            </span>
          </div>

          <h3 className="font-bold text-lg text-white truncate">{heroi.nome}</h3>
          <p className="text-sm font-semibold" style={{ color: heroi.cor }}>
            {heroi.nome_rank || 'Sem rank'}
          </p>
          <p className="text-purple-300 text-sm capitalize">{heroi.classe}</p>
          <p className="text-gray-400 text-xs mt-1">Nível {heroi.nivel}</p>
          <p className="text-gray-500 text-xs">XP: {heroi.xp ?? heroi.pontos_xps}</p>

          {heroi.titulos && (
            <p className="text-yellow-400/80 text-xs mt-2 truncate">{heroi.titulos}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default Cards;