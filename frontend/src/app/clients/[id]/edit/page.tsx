'use client'

import { useRouter, useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ClientForm } from '@/components/client-form'
import { Client, ClientFormData } from '@/types/client'

export default function EditClientPage() {
  const router = useRouter()
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string)
  const queryClient = useQueryClient()

  const { data: client, isLoading, isError } = useQuery<Client>({
    queryKey: ['client', id],
    queryFn: async () => {
      if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error("ID do cliente inválido ou ausente.");
      }
      const response = await axios.get(`http://localhost:3333/clients/${id}`)
      return response.data
    },
    enabled: !!id && typeof id === 'string' && id.trim() !== '',
  })

  const mutation = useMutation<void, AxiosError, ClientFormData>({
    mutationFn: async (updatedClient) => {
      if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error("Não é possível atualizar: ID do cliente inválido ou ausente.");
      }
      await axios.put(`http://localhost:3333/clients/${id}`, updatedClient)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      alert('Cliente atualizado com sucesso!')
      router.push('/clients')
    },
    onError: (error) => {
      console.error('Erro ao atualizar cliente:', error)
      const errorMessage = (error.response?.data as { message?: string })?.message || 'Falha ao atualizar cliente. Por favor, tente novamente.'
      alert(`Erro ao atualizar cliente: ${errorMessage}`)
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 px-4 pt-12 flex flex-col items-center text-white">
        <div className="flex flex-col items-center justify-center p-6 bg-gray-900 text-orange-500 rounded-lg shadow-lg border border-orange-700">
          <svg className="animate-spin h-7 w-7 mb-3 text-orange-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-semibold">Carregando dados do cliente...</p>
        </div>
      </div>
    )
  }

  if (isError || !client) {
    const errorMessage = isError ? "Falha ao carregar detalhes do cliente." : "Cliente não encontrado ou dados indisponíveis.";
    return (
      <div className="min-h-screen bg-gray-950 px-4 pt-12 flex flex-col items-center text-white">
        <div className="flex flex-col items-center justify-center p-6 bg-gray-900 text-red-500 rounded-lg shadow-lg border border-red-700 text-center">
          <p className="text-lg font-semibold">❌ {errorMessage}</p>
          <p className="text-sm text-gray-400 mt-2">Por favor, verifique o ID do cliente e certifique-se de que o servidor backend está rodando em http://localhost:3333.</p>
          <button
            onClick={() => router.push('/clients')}
            className="mt-5 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-5 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
          >
            Voltar para Clientes
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = (data: ClientFormData) => {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      alert("Erro: ID do cliente inválido ou ausente. Não é possível atualizar.");
      return;
    }
    mutation.mutate(data)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-12 flex flex-col items-center p-4">
      {/* Título estilizado para 'Editar Cliente' */}
      <h1 className="text-3xl font-extrabold text-orange-500 text-center mb-6 tracking-tight">
        Editar Cliente
      </h1>
      <ClientForm
        defaultValues={{
          name: client.name,
          email: client.email,
          status: client.status,
        }}
        onSubmit={handleSubmit}
      />
    </div>
  )
}