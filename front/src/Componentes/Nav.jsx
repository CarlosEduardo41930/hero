import { Link, useNavigate } from "react-router-dom";

function Nav() {
    const usuario = localStorage.getItem("usuario");
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        navigate("/login");
    }

    return (
        <nav className="flex justify-between items-center bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-4">
            <h1 className="text-xl font-bold text-white tracking-wide">
                Recrutador <span className="text-purple-400">{usuario}</span>
            </h1>
            <ul className="flex items-center gap-6">
                <li>
                    <Link to="/" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-lg">home</span>
                        Início
                    </Link>
                </li>
                <li>
                    <Link to="/heroi/novo" className="text-slate-300 hover:text-white transition-colors">
                        Novo Herói
                    </Link>
                </li>
                <li>
                    <Link to="/guildas" className="text-slate-300 hover:text-white transition-colors">
                        Guildas
                    </Link>
                </li>
                <li>
                    <Link to="/missoes" className="text-slate-300 hover:text-white transition-colors">
                        Missões
                    </Link>
                </li>
                <li>
                    <Link to="/perfil" className="text-slate-300 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
                            <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z"/>
                        </svg>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Nav