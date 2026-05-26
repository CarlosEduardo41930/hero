import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
function RecrutamentoHerois() {
  const queryClient = useQueryClient();

  // --- ESTADOS DO FORMULÁRIO ---
  const [nome, setNome] = useState('');
  const [classe, setClasse] = useState('');
  const [poder, setPoder] = useState('');

  // ============================================
  // 1. useQuery — BUSCAR LISTA DE HERÓIS (GET)
  // ============================================
  // Roda automaticamente quando o componente carrega
  // Gerencia cache e sincroniza com o servidor
  const { data: herois, isLoading } = useQuery({
    queryKey: ['heroi'],
    queryFn: () => axios.get('/herois').then(res => res.data)
  });

  // ============================================
  // 2. useMutation — ADICIONAR HERÓI (POST)
  // ============================================
  // NÃO roda automaticamente. Só acontece sob demanda.
  const adicionarHeroi = useMutation({
    mutationFn: (newHero) => {
      return axios.post('/herois', newHero);
      // O Axios converte automaticamente para JSON
      // e configura o header Content-Type
    },

    // --- CICLO DE VIDA DA MUTAÇÃO ---

    // Executado ANTES da requisição (prepara a UI)
    onMutate: () => {
      console.log('Preparando envio...');
    },

    // Executado quando o servidor responde com SUCESSO
    onSuccess: () => {
      // INVALIDA O CACHE → força re-buscar a lista atualizada
      queryClient.invalidateQueries({
        queryKey: ['heroi']
      });

      // Limpa o formulário
      setNome('');
      setClasse('');
      setPoder('');
    },

    // Executado se houver FALHA na rede
    onError: (error) => {
      alert('Erro ao salvar: ' + error.message);
    },

    // Executado SEMPRE ao final (sucesso ou erro)
    onSettled: () => {
      console.log('Mutação finalizada.');
    }
  });

  // ============================================
  // 3. useMutation — REMOVER HERÓI (DELETE)
  // ============================================
  const removerHeroi = useMutation({
    mutationFn: (id) => {
      return axios.delete(`/herois/${id}`);
    },
    onSuccess: () => {
      // Atualiza a lista automaticamente após remover
      queryClient.invalidateQueries({
        queryKey: ['heroi']
      });
    },
    onError: (error) => {
      alert('Erro ao remover: ' + error.message);
    }
  });

  // ============================================
  // 4. FUNÇÃO DE ENVIO DO FORMULÁRIO
  // ============================================
  function handleSubmit(e) {
    e.preventDefault();

    // Validações simples
    if (nome.length < 3) {
      alert('Nome deve ter no mínimo 3 caracteres');
      return;
    }
    if (!classe) {
      alert('Selecione uma classe');
      return;
    }
    const poderNumerico = Number(poder);
    if (poderNumerico < 0 || poderNumerico > 100) {
      alert('Poder deve estar entre 0 e 100');
      return;
    }

    // Dispara a mutação sob demanda passando os dados
    adicionarHeroi.mutate({
      nome: nome,
      classe: classe,
      poder: poderNumerico
    });
  }

  // ============================================
  // 5. RENDERIZAÇÃO DA INTERFACE
  // ============================================
  return (
    <div>
      <h1>Portal de Recrutamento V2</h1>

      {/* --- FORMULÁRIO --- */}
      <form onSubmit={handleSubmit}>
        {/* Campo: Nome (String, mínimo 3 caracteres) */}
        <label>Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do herói"
        />

        {/* Campo: Classe (String/Enum, selecionável) */}
        <label>Classe:</label>
        <select
          value={classe}
          onChange={(e) => setClasse(e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="Guerreiro">Guerreiro</option>
          <option value="Mago">Mago</option>
          <option value="Arqueiro">Arqueiro</option>
        </select>

        {/* Campo: Poder (Number, de 0 a 100) */}
        <label>Poder:</label>
        <input
          type="number"
          value={poder}
          onChange={(e) => setPoder(e.target.value)}
          placeholder="0 a 100"
        />

        {/* Botão mostra "Salvando..." quando isPending é true */}
        <button type="submit" disabled={adicionarHeroi.isPending}>
          {adicionarHeroi.isPending ? 'Salvando...' : 'Recrutar'}
        </button>

        {/* Estado: isError — mostra mensagem de erro */}
        {adicionarHeroi.isError && (
          <p>Algo falhou: {adicionarHeroi.error.message}</p>
        )}
      </form>

      {/* --- GALERIA DE HERÓIS --- */}
      <h2>Heróis Recrutados</h2>

      {isLoading ? (
        <p>Carregando heróis...</p>
      ) : (
        <ul>
          {herois?.map((heroi) => (
            <li key={heroi.id}>
              <strong>{heroi.nome}</strong> — {heroi.classe} — Poder: {heroi.poder}
              {/* Botão de remover — dispara a mutação DELETE */}
              <button
                onClick={() => removerHeroi.mutate(heroi.id)}
                disabled={removerHeroi.isPending}
              >
                {removerHeroi.isPending ? 'Removendo...' : 'Dispensar'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecrutamentoHerois;
