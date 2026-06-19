//import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Routes, Route } from 'react-router-dom'
// PARA O Layout
import Heroi from './Componentes/Heroi'
import CriarHeroi from './Componentes/CriarHeroi'
import Perfil from './Paginas/Perfil'
import Home from './Componentes/Home'


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
        <Route path='/' element={<CriarHeroi/>} />
        <Route path='/perfil' element={<Perfil  />} />
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
