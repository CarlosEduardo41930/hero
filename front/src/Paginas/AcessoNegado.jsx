function AcessoNegado() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white">Acesso Negado</h1>
                <p className="text-lg text-white mt-4">
                    Você não tem permissão para acessar esta página.
                </p>
            </div>
        </div>
    );
}

export default AcessoNegado;