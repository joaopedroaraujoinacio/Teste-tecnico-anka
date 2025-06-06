// src/app/clients/page.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import { columns } from './columns'
import { DataTable } from '../../components/data-table'
import { Client } from '@/types/client'
import { Button } from '@/components/ui/button'

async function fetchClients(): Promise<Client[]> {
  const response = await axios.get('http://localhost:3333/clients')
  return response.data.data
}

export default function ClientsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-8">
        <div className="flex flex-col items-center justify-center p-8 bg-gray-900 text-orange-500 rounded-lg shadow-lg border border-orange-700">
          <svg className="animate-spin h-8 w-8 mb-4 text-orange-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl font-semibold">Carregando clientes...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-8">
        <div className="flex flex-col items-center justify-center p-8 bg-gray-900 text-red-500 rounded-lg shadow-lg border border-red-700">
          <p className="text-xl font-semibold">❌ Erro ao carregar clientes. Por favor, tente novamente mais tarde.</p>
          <p className="text-sm text-gray-400 mt-2">Verifique se o servidor backend está rodando em http://localhost:3333.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8 bg-gray-900 p-8 rounded-xl shadow-2xl border border-orange-600">
        {/* Cabeçalho da página com título e botões agrupados */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-800">
          <h1 className="text-4xl font-extrabold text-orange-500 tracking-tight">
            Gestão de Clientes
          </h1>
          {/* Agrupamento dos botões */}
          <div className="flex gap-4"> {/* Adiciona um gap para espaçamento entre os botões */}
            <Link href="/" passHref>
              <Button
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                Página Inicial
              </Button>
            </Link>
            <Link href="/clients/create" passHref>
              <Button
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                Cadastrar Cliente
              </Button>
            </Link>
          </div>
        </div>

        <DataTable columns={columns} data={data ?? []} />
      </div>
    </div>
  )
}