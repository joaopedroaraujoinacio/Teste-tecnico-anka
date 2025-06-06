import { z } from "zod"

export const clientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  status: z.boolean(),
})

export type ClientFormData = z.infer<typeof clientSchema>

export interface Client {
  id: number
  name: string
  email: string
  status: boolean
}
