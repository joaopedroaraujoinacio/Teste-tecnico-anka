'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  assetId: z.string().min(1, 'Selecione um ativo'),
  quantity: z.coerce.number().positive('Quantidade deve ser maior que 0'),
})

type FormData = z.infer<typeof schema>

type Asset = {
  id: number
  name: string
  symbol: string
}

export function AllocateAssetsForm() {
  const params = useParams()
  const clientId = Number(params.id)

  const queryClient = useQueryClient()

  const { register, handleSubmit, formState, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const { data: assetsData, isLoading: isLoadingAssets } = useQuery<{ data: Asset[] }>({
    queryKey: ['assets'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3333/assets')
      return res.data
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await axios.post(`http://localhost:3333/clients/${clientId}/assets`, data)
    },
    onSuccess: () => {
      alert('Ativo alocado com sucesso!')
      reset()
      queryClient.invalidateQueries({ queryKey: ['client-assets', clientId] })
    },
    onError: () => {
      alert('Erro ao alocar ativo.')
    },
  })

  async function onSubmit(data: FormData) {
    await mutation.mutateAsync(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-900 p-6 rounded-lg border border-orange-700 shadow-md">
      <h2 className="text-xl font-bold text-orange-400">Alocar novo ativo</h2>

      <div className="space-y-2">
        <Label htmlFor="assetId" className="text-white">Ativo</Label>
        <select
          {...register('assetId')}
          className="w-full bg-gray-800 text-white rounded px-3 py-2"
        >
          <option value="">Selecione um ativo</option>
          {assetsData?.data.map((asset) => (
            <option key={asset.id} value={String(asset.id)}>
              {asset.name} ({asset.symbol})
            </option>
          ))}
        </select>
        {formState.errors.assetId && (
          <p className="text-red-500 text-sm">{formState.errors.assetId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity" className="text-white">Quantidade</Label>
        <Input type="number" {...register('quantity')} className="bg-gray-800 text-white" />
        {formState.errors.quantity && (
          <p className="text-red-500 text-sm">{formState.errors.quantity.message}</p>
        )}
      </div>

      <Button type="submit" disabled={mutation.isPending || isLoadingAssets} className="bg-orange-600 hover:bg-orange-700">
        {mutation.isPending ? 'Alocando...' : 'Alocar ativo'}
      </Button>
    </form>
  )
}
