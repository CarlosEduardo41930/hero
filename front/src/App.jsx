//import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Routes, Route } from 'react-router-dom'
import Login from './Paginas/Login'
import Cadastro from './Paginas/Cadastro'
import Layout from './Paginas/Layout'
import AcessoNegado from './Paginas/AcessoNegado'
import { Navigate } from 'react-router-dom'

const queryClient = new QueryClient()

function App() {


  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path='/teste' element={<Layout />} />
        <Route path='/cadastro' element={<Cadastro />} />
        <Route path='/login' element={<Login />} />
        <Route path='/acesso-negado' element={<AcessoNegado />} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App
