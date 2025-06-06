'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link' // Importe Link
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button' // Importe Button
import { Asset } from '@/types/assets'

export default function AssetsPage() {
  const { data, isLoading, isError } = useQuery<{ data: Asset[] }>({
    queryKey: ['assets'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3333/assets')
      return res.data
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-8">
        <div className="flex flex-col items-center justify-center p-8 bg-gray-900 text-orange-500 rounded-lg shadow-lg border border-orange-700">
          <svg className="animate-spin h-8 w-8 mb-4 text-orange-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl font-semibold">Carregando ativos...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-8">
        <div className="flex flex-col items-center justify-center p-8 bg-gray-900 text-red-500 rounded-lg shadow-lg border border-red-700">
          <p className="text-xl font-semibold">❌ Erro ao carregar ativos. Por favor, tente novamente mais tarde.</p>
          <p className="text-sm text-gray-400 mt-2">Verifique se o servidor backend está rodando em http://localhost:3333.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8 bg-gray-900 p-8 rounded-xl shadow-2xl border border-orange-600">
        {/* Cabeçalho da página com título e botões de navegação */}
        <div className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b border-gray-800 gap-4 sm:gap-0">
          <h1 className="text-4xl font-extrabold text-orange-500 tracking-tight text-center sm:text-left">
            Ativos Financeiros
          </h1>
          {/* Contêiner dos botões de navegação */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Botão "Voltar para Clientes" */}
            <Link href="/clients" passHref>
              <Button
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md w-full sm:w-auto"
              >
                Voltar para Gestão de Clientes
              </Button>
            </Link>

            {/* Botão "Página Inicial" */}
            <Link href="/" passHref>
              <Button
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md w-full sm:w-auto"
              >
                Página Inicial
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data.map((asset) => (
            <Card
              key={asset.id}
              className="p-6 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700 transition-all duration-300 hover:border-orange-500 hover:shadow-xl transform hover:-translate-y-1"
            >
              <h2 className="text-2xl font-bold text-orange-400 mb-2">{asset.name}</h2>
              <p className="text-gray-300 text-sm mb-1">
                <span className="font-semibold text-gray-100">Tipo:</span> {asset.type}
              </p>
              <p className="text-gray-300 text-sm mb-1">
                <span className="font-semibold text-gray-100">Símbolo:</span>{' '}
                <span className="font-mono text-orange-300">{asset.symbol}</span>
              </p>
              <p className="text-2xl font-extrabold mt-4 text-green-400">
                R$ {asset.price.toFixed(2)}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}