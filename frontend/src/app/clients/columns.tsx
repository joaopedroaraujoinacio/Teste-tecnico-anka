// src/app/clients/columns.tsx
'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Client } from '@/types/client'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

function ActionsCell({ client }: { client: Client }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const deleteClient = async () => {
    const confirmed = confirm(`Tem certeza que deseja excluir ${client.name}?`)
    if (!confirmed) return

    try {
      await axios.delete(`http://localhost:3333/clients/${client.id}`)
      await queryClient.invalidateQueries({ queryKey: ['clients'] })
      alert('Cliente excluído com sucesso!')
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ?? 'Falha ao excluir cliente. Tente novamente.'
        alert(message)
      } else {
        alert('Erro desconhecido ao excluir cliente.')
      }
      console.error('Erro ao excluir cliente:', error)
    }
  }

  return (
    <div className="flex gap-3 justify-center">
      {/* Botão "Ver ativos" */}
      <button
        className="text-blue-400 hover:text-blue-500 font-medium transition-colors duration-200"
        onClick={() => router.push(`/clients/${client.id}`)}
      >
        Ver ativos
      </button>

      {/* Botão "Editar" */}
      <button
        className="text-orange-400 hover:text-orange-500 font-medium transition-colors duration-200"
        onClick={() => router.push(`/clients/${client.id}/edit`)}
      >
        Editar
      </button>

      {/* Botão "Excluir" */}
      <button
        className="text-red-400 hover:text-red-500 font-medium transition-colors duration-200"
        onClick={deleteClient}
      >
        Excluir
      </button>
    </div>
  )
}

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => <span className="text-gray-100">{row.original.name}</span>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <span className="text-gray-100">{row.original.email}</span>,
  },
  {
    accessorKey: 'status',
    // --- AJUSTE AQUI: Centralizando o cabeçalho "Ativo?" ---
    header: () => <div className="text-center">Ativo</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <span
          className={`py-1 px-3 rounded-full text-xs font-semibold ${
            row.original.status ? 'bg-orange-600' : 'bg-gray-500'
          } text-white`}
        >
          {row.original.status ? 'Sim' : 'Não'}
        </span>
      </div>
    ),
  },
  {
    id: 'actions',
    // --- AJUSTE AQUI: Centralizando o cabeçalho "Ações" ---
    header: () => <div className="text-center">Ações</div>,
    cell: ({ row }) => <ActionsCell client={row.original} />,
  },
]