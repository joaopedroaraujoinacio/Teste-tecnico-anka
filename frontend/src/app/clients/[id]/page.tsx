'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios' // Importe AxiosError
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Interfaces para os dados
interface Client {
  id: number
  name: string
  email: string
  status: boolean
}

interface Asset {
  id: number
  name: string
  type?: string // Pode ser opcional se nem todo ativo tiver
  symbol?: string // Pode ser opcional se nem todo ativo tiver
  price: number // Assumindo 'price' do backend como 'value' no frontend
}

interface ClientAssetsResponse {
  assetIds: number[] // Lista de IDs dos ativos alocados a este cliente
}

export default function ClientAssetsPage() {
  const params = useParams()
  // Certifique-se de que `id` é uma string antes de converter para Number
  const clientId = Number(params.id as string)

  const [selectedAssets, setSelectedAssets] = useState<number[]>([])

  // Query para buscar dados do cliente
  const { data: clientData, isLoading: clientLoading, isError: clientError } = useQuery<Client>({
    queryKey: ['client', clientId],
    queryFn: async () => {
      if (isNaN(clientId)) { // Validação adicional para clientId
        throw new Error("ID do cliente inválido.");
      }
      const res = await axios.get(`http://localhost:3333/clients/${clientId}`)
      return res.data
    },
    enabled: !isNaN(clientId), // Só executa a query se clientId for um número válido
  })

  // Query para buscar todos os ativos disponíveis
  const { data: allAssetsData, isLoading: assetsLoading, isError: assetsError } = useQuery<Asset[]>({
    queryKey: ['allAssets'], // Chave única para todos os ativos
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3333/assets`)
      return res.data.data // Seu backend retorna { data: [...] }
    },
  })

  // Query para buscar os ativos já alocados ao cliente
  const { data: clientAllocatedAssetsData, refetch: refetchClientAssets } = useQuery<ClientAssetsResponse>({
    queryKey: ['clientAllocatedAssets', clientId],
    queryFn: async () => {
      if (isNaN(clientId)) {
        throw new Error("ID do cliente inválido para buscar ativos alocados.");
      }
      const res = await axios.get(`http://localhost:3333/clients/${clientId}/assets`)
      return res.data // Seu backend retorna { assetIds: [...] }
    },
    enabled: !isNaN(clientId), // Só executa a query se clientId for um número válido
  })

  // Efeito para sincronizar os ativos selecionados com os dados do cliente
  useEffect(() => {
    if (clientAllocatedAssetsData?.assetIds) {
      setSelectedAssets(clientAllocatedAssetsData.assetIds)
    } else {
      // Se clientAllocatedAssetsData ou assetIds for null/undefined, garanta que selectedAssets seja um array vazio
      setSelectedAssets([]);
    }
  }, [clientAllocatedAssetsData])

  // Mutação para atualizar os ativos do cliente
  const { mutate: updateClientAssets, isPending } = useMutation({
    mutationFn: async () => {
      if (isNaN(clientId)) {
        throw new Error("Não é possível atualizar: ID do cliente inválido.");
      }

      // 1. Desalocar todos os ativos existentes para este cliente
      await axios.delete(`http://localhost:3333/clients/${clientId}/assets`)

      // 2. Alocar os ativos selecionados
      if (selectedAssets.length > 0) {
        await Promise.all(
          selectedAssets.map((assetId) =>
            axios.post(`http://localhost:3333/clients/${clientId}/assets`, {
              assetId,
              quantity: 1, // Assumindo quantidade 1 como padrão
            })
          )
        )
      }
    },
    onSuccess: () => {
      alert('Ativos do cliente atualizados com sucesso!')
      refetchClientAssets() // ✅ Usado aqui!
    },
    onError: (error: AxiosError) => {
      console.error('Erro ao atualizar ativos do cliente:', error)
      const errorMessage = (error.response?.data as { message?: string })?.message || 'Erro desconhecido ao atualizar ativos.'
      alert(`Erro ao atualizar ativos do cliente: ${errorMessage}`)
    },
  })

  // Função para alternar a seleção de um ativo
  const toggleAsset = (assetId: number) => {
    setSelectedAssets((prev) =>
      prev.includes(assetId)
        ? prev.filter((id) => id !== assetId)
        : [...prev, assetId]
    )
  }

  // --- Renderização de Estados de Carregamento e Erro ---
  if (clientLoading || assetsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-8">
        <div className="flex flex-col items-center justify-center p-6 bg-gray-900 text-orange-500 rounded-lg shadow-lg border border-orange-700">
          <svg className="animate-spin h-7 w-7 mb-3 text-orange-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-semibold">Carregando dados...</p>
        </div>
      </div>
    )
  }

  // Tratamento de erros detalhado
  if (clientError || assetsError || !clientData || !allAssetsData) {
    const errorMsg = clientError ? "Erro ao carregar dados do cliente." : assetsError ? "Erro ao carregar ativos." : "Dados não disponíveis.";
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-8">
        <div className="flex flex-col items-center justify-center p-6 bg-gray-900 text-red-500 rounded-lg shadow-lg border border-red-700 text-center">
          <p className="text-lg font-semibold">❌ {errorMsg}</p>
          <p className="text-sm text-gray-400 mt-2">Verifique se o servidor backend está rodando em http://localhost:3333 e se o ID do cliente é válido.</p>
          <Link href="/clients" passHref>
            <Button
              className="mt-5 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-5 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              Voltar para Clientes
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // --- Renderização Principal ---
  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-xl mx-auto space-y-6 bg-gray-900 p-6 rounded-xl shadow-2xl border border-orange-600">
        {/* Cabeçalho da página com título e botão de voltar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pb-3 border-b border-gray-800 gap-3 sm:gap-0">
          <h1 className="text-3xl font-extrabold text-orange-500 tracking-tight text-center sm:text-left">
            Gerenciar Ativos
          </h1>
          {/* Botão de Voltar para Clientes */}
          <Link href="/clients" passHref>
            <Button
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-5 rounded-lg text-sm transition duration-300 ease-in-out transform hover:scale-105 shadow-md w-full sm:w-auto"
            >
              Voltar para Clientes
            </Button>
          </Link>
        </div>

        {/* Informações do Cliente */}
        <Card className="p-4 bg-gray-800 text-white rounded-lg shadow-md border border-gray-700">
          <h2 className="text-xl font-bold text-orange-400 mb-1">Cliente: {clientData.name}</h2>
          <p className="text-gray-300 text-sm">
            <span className="font-semibold text-gray-100">Email:</span> {clientData.email}
          </p>
          <p className="text-gray-300 text-sm">
            <span className="font-semibold text-gray-100">Status:</span>{' '}
            <span className={clientData.status ? 'text-green-400' : 'text-red-400'}>
              {clientData.status ? 'Ativo' : 'Inativo'}
            </span>
          </p>
        </Card>

        {/* Lista de Ativos Disponíveis */}
        <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b border-gray-800 pb-2 text-orange-500">
          Ativos para Alocar
        </h2>
        <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {allAssetsData && allAssetsData.length > 0 ? (
            allAssetsData.map((asset) => (
              <Card
                key={asset.id}
                className={`p-3 bg-gray-800 text-white rounded-lg shadow-sm border
                  ${(selectedAssets || []).includes(asset.id) ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-700'}
                  transition-all duration-200 hover:border-orange-500 hover:shadow-md cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  {/* Área clicável para toggle do ativo */}
                  <div className="flex items-center flex-grow" onClick={() => toggleAsset(asset.id)}>
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 mr-3 cursor-pointer"
                      checked={(selectedAssets || []).includes(asset.id)}
                      onChange={(e) => e.stopPropagation()}
                    />
                    <div>
                      <h3 className="text-lg font-bold text-orange-400">{asset.name}</h3>
                      <p className="text-gray-300 text-xs">{asset.symbol || 'N/A'}</p>
                    </div>
                  </div>
                  <p className="text-lg font-extrabold text-green-400 ml-auto">R$ {asset.price.toFixed(2)}</p>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-400">Nenhum ativo disponível para alocação.</p>
          )}
        </div>

        {/* Botão de Salvar */}
        <Button
          onClick={() => updateClientAssets()}
          disabled={isPending}
          className={`w-full px-5 py-2 rounded-lg text-white font-bold text-base transition duration-300 ease-in-out transform hover:scale-105 shadow-md
            ${isPending ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-75'}`}
        >
          {isPending ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </div>
    </div>
  )
}