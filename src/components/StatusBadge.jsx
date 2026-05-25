function StatusBadge({ tipo }) {
  const estilos = {
    online: "bg-green-500",
    offline: "bg-gray-500",
    ausente: "bg-amber-500"
  };

  return (
    <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full w-fit mb-3">
      <div className={`w-2 h-2 rounded-full ${estilos[tipo] || estilos.offline}`}></div>
      <span className="text-xs font-bold uppercase text-gray-200">{tipo}</span>
    </div>
  );
}

export default StatusBadge;