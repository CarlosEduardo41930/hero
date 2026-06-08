//import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Routes, Route } from 'react-router-dom'
import Login from './Paginas/Login'
import Cadastro from './Paginas/Cadastro'

const queryClient = new QueryClient()

function App() {


  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path='/cadastro' element={<Cadastro />} />
        {/* <Route path='/cadastro' element={<h1>Cadastro</h1>} /> */}
        <Route path='/' element={<Login />} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App
