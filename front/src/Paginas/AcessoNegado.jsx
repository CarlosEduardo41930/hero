import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

function AcessoNegado() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-12 shadow-2xl"
            >
                <h1 className="text-5xl font-bold text-white mb-4">403</h1>
                <p className="text-xl text-gray-300 mb-6">Acesso Negado</p>
                <Link to="/login"
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition hover:scale-[1.02] active:scale-[0.98]">
                    Voltar para login
                </Link>
            </motion.div>
        </div>
    );
}

export default AcessoNegado;