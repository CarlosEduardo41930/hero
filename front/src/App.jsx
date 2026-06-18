//import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Routes, Route } from 'react-router-dom'
import Login from './Paginas/Login'
import Cadastro from './Paginas/Cadastro'
import Layout from './Paginas/Layout'
import Heroi from './Paginas/Heroi'
import CriarHeroi from './Paginas/CriarHeroi'
import Perfil from './Paginas/Perfil'
import AcessoNegado from './Paginas/AcessoNegado'


const queryClient = new QueryClient()

function App() {


  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path='/teste' element={<Layout />} />
        <Route path='/cadastro' element={<Cadastro />} />
        <Route path='/login' element={<Login />} />
        <Route path='/acesso-negado' element={<AcessoNegado />} />
        <Route path='/heroi/:id' element={<Heroi />} />
        <Route path='/' element={<CriarHeroi/>} />
        <Route path='/perfil' element={<Perfil />} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App
