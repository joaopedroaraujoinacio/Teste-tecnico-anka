'use client'

import { Client } from '@/types/client'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export function ActionsCell({ client }: { client: Client }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const deleteClient = async () => {
    if (confirm(`Tem certeza que deseja excluir ${client.name}?`)) {
      await axios.delete(`http://localhost:3333/clients/${client.id}`)
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    }
  }

  return (
    <div className="flex gap-2">
      <button
        className="text-blue-600 hover:underline"
        onClick={() => router.push(`/clients/${client.id}/edit`)}
      >
        Editar
      </button>
      <button
        className="text-red-600 hover:underline"
        onClick={deleteClient}
      >
        Excluir
      </button>
    </div>
  )
}
