//import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Routes, Route } from 'react-router-dom'
// PARA O Layout
import Heroi from './Componentes/Heroi'
import CriarHeroi from './Componentes/CriarHeroi'
import Perfil from './Paginas/Perfil'
import Home from './Componentes/Home'
import CriarGuildas from './Componentes/CriarGuildas'
import Guildas from './Componentes/Guildas'
import Missoes from './Componentes/Missoes'
import CriarMissoes from './Componentes/CriarMissoes'


// PARA O PAGINA
import Login from './Paginas/Login'
import Cadastro from './Paginas/Cadastro'
import Layout from './Paginas/Layout'
import AcessoNegado from './Paginas/AcessoNegado'


const queryClient = new QueryClient()

function App() {


  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<Layout />}>
        <Route path='/teste' element={<Home />} />
        <Route path='/heroi/:id' element={<Heroi />} />
        <Route path='/heroi/novo' element={<CriarHeroi/>} />
        <Route path='/perfil' element={<Perfil  />} />
        <Route path='/guildas/novo' element={<CriarGuildas  />} />
        <Route path='/guildas' element={<Guildas />} />
        <Route path='/missoes' element={<Missoes />} />
        <Route path='/missoes/novo' element={<CriarMissoes />} />
        </Route>
        <Route path='/teste' element={<Layout />} />
        <Route path='/cadastro' element={<Cadastro />} />
        <Route path='/login' element={<Login />} />
        <Route path='/acesso-negado' element={<AcessoNegado />} />
        
        
        
      </Routes>
    </QueryClientProvider>
  )
}

export default App
