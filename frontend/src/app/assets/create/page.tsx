'use client'

import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

// Schema de validação
const schema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  value: z.coerce.number().positive('O valor deve ser positivo'),
})

type FormData = z.infer<typeof schema>

export default function CreateAssetPage() {
  const { id: clientId } = useParams()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post('http://localhost:3333/assets', {
        ...data,
        clientId,
      })
      alert('Ativo criado com sucesso!')
      reset()
    } catch (err) {
  console.error('Erro ao criar ativo:', err)
  alert('Erro ao criar ativo.')
}
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-gray-900 p-6 rounded-lg border border-orange-700 shadow-md text-white"
    >
      <h2 className="text-xl font-bold text-orange-400">Cadastrar novo ativo</h2>

      <div className="space-y-2">
        <Label htmlFor="name">Nome do ativo</Label>
        <Input id="name" {...register('name')} className="bg-gray-800 text-white" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">Valor do ativo</Label>
        <Input type="number" id="value" {...register('value')} className="bg-gray-800 text-white" />
        {errors.value && <p className="text-red-500 text-sm">{errors.value.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="bg-orange-600 hover:bg-orange-700">
        {isSubmitting ? 'Salvando...' : 'Salvar ativo'}
      </Button>
    </form>
  )
}
