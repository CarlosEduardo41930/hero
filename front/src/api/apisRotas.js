 import Api from "./validacao";


export async function apiLogin(dados) {
  return Api.post('/login', dados);
}

export async function apiCadastrar(dados) {
    return Api.post('/cadastro', dados);
}

export async function apiMostrarHerois() {
        const res = await Api.get('/herois',);
        return res.data;
    }

