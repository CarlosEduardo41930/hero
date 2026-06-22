import Api from "./validacao";


export async function apiLogin(dados) {
  return Api.post('/login', dados);
}

export async function apiCadastrar(dados) {
  return Api.post('/cadastro', dados);
}

export async function apiMostrarHerois() {
  const res = await Api.get('/herois',);
  return {
    status: res.status,
    data: res.data
  };
}

export async function heroi(id) {
  const res = await Api.get(`/heroi/${id}`);
  return {
    status: res.status,
    data: res.data
  };
  
}

export async function apiAdicionarHeroi(dados) {
  const res = await Api.post('/herois/adicionar', dados);
  return {
    status: res.status,
    data: res.data
  };

}

export async function apiGuildas() {
  const res = await Api.get('/herois/guildas',);
  return {
    status: res.status,
    data: res.data
  };

}

export async function apiBuscarPerfil() {
  const res = await Api.get('/usuario/perfil');
  return {
    status: res.status,
    data: res.data
  };
}


export async function apiAtualizarPerfil(dados) {
  const res = await Api.put('/usuario/perfil/atualizar', dados);
  return {
    status: res.status,
    data: res.data
  };
}


export async function apiAdicionarGuilda(dados) {
  const res = await Api.post('/guilda/adicionar', dados);
  return {
    status: res.status,
    data: res.data
  };
}

export async function apiMostrarGuildas() {
  const res = await Api.get('/guilda');
  return {
    status: res.status,
    data: res.data
  };
}

export async function apiMissoes() {
  const res = await Api.get("http://localhost:418/missao");
  return {
    status: res.status,
    data: res.data
  };
}
export async function apiCriarMissao (data) {
  const res = await Api.post("http://localhost:418/missao/adicionar", data);
  return {
    status: res.status,
    data: res.data
  };
}

export async function apiExcluirHeroi(id) {
  const res = await Api.delete(`/heroi/${id}`);

  return {
    status: res.status,
    data: res.data
  };
}

export async function apiFecharMissao(id) {
  const res = await Api.put(`/missao/fechar/${id}`);
  return {
    status: res.status,
    data: res.data
  };
}