import { motion } from "framer-motion";

function CardGuilda({ guilda }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 p-5 w-72 hover:border-purple-400/40 transition-colors shadow-lg"
    >
      <h2 className="font-bold text-xl text-white text-center mb-1">
        {guilda.nome}
      </h2>

      <p className="font-semibold text-center text-base" style={{ color: guilda.cor }}>
        {guilda.nome_rank || "Sem Rank"}
      </p>

      <div className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Pontos</span>
          <span className="text-white font-medium">{guilda.pontos}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Ouro</span>
          <span className="text-yellow-400 font-medium">{guilda.ouro}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Especialização</span>
          <span className="text-white font-medium">{guilda.especializacao || "Não definida"}</span>
        </div>
      </div>

      {guilda.descricao && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-gray-400 text-xs">{guilda.descricao}</p>
        </div>
      )}
    </motion.div>
  );
}

export default CardGuilda;