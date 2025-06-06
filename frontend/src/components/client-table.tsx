// src/components/client-table.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Client = {
  id: number
  name: string
  email: string
  status: boolean
}

export function ClientTable() {
  const { data, isLoading, error } = useQuery<{ data: Client[] }>({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3333/clients')
      return response.data
    },
  })

  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro ao carregar clientes</p>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Nome</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((client) => (
            <tr key={client.id}>
              <td className="px-4 py-2 border">{client.id}</td>
              <td className="px-4 py-2 border">{client.name}</td>
              <td className="px-4 py-2 border">{client.email}</td>
              <td className="px-4 py-2 border">
                {client.status ? 'Ativo' : 'Inativo'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
