function CardGuilda({ guilda }) {
  return (
    <div className="bg-gray-300 rounded-lg shadow-md p-4 w-72 hover:shadow-xl transition">
      
      <h2 className="font-bold text-xl text-center mb-2">
        {guilda.nome}
      </h2>

      <p
        className="font-semibold text-center text-lg"
        style={{ color: guilda.cor }}
      >
        {guilda.nome_rank || "Sem Rank"}
      </p>

      <div className="mt-3 space-y-1 text-sm">
        <p>
          <strong>ID:</strong> {guilda.id_guilda}
        </p>

        <p>
          <strong>Pontos:</strong> {guilda.pontos}
        </p>

        <p>
          <strong>Ouro:</strong> {guilda.ouro}
        </p>

        <p>
          <strong>Exposição:</strong> {guilda.expose}
        </p>

        <p>
          <strong>Especialização:</strong>{" "}
          {guilda.especializacao || "Não definida"}
        </p>

        <p>
          <strong>Ordem:</strong> {guilda.ordem}
        </p>

      </div>

      <div className="mt-4 border-t pt-3">
        <p className="font-semibold">Descrição:</p>
        <p className="text-sm text-gray-700 break-words">
          {guilda.descricao || "Sem descrição"}
        </p>
      </div>
    </div>
  );
}

export default CardGuilda;