import Fastify from 'fastify'
import cors from '@fastify/cors'
import { z } from 'zod'
import { PrismaClient } from '../generated/prisma/index.js'

const app = Fastify()
const prisma = new PrismaClient()

await app.register(cors, {
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
})

// Schemas
const paramsSchema = z.object({
  id: z.string().transform(Number),
})

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  status: z.boolean(),
})

// GET todos os clientes
app.get('/clients', async () => {
  const clients = await prisma.client.findMany()
  return { data: clients }
})

// GET cliente por ID
app.get('/clients/:id', async (request, reply) => {
  const { id } = paramsSchema.parse(request.params)

  const client = await prisma.client.findUnique({
    where: { id },
  })

  if (!client) {
    return reply.status(404).send({ message: 'Cliente não encontrado' })
  }

  return { ...client }
})

// GET ativos alocados para um cliente
app.get('/clients/:id/assets', async (request, reply) => {
  const { id: clientId } = paramsSchema.parse(request.params)

  try {
    const clientAssets = await prisma.clientAsset.findMany({
      where: { clientId },
      select: { assetId: true },
    })

    const assetIds = clientAssets.map((ca) => ca.assetId)
    return reply.send({ assetIds })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar ativos do cliente'
    return reply.status(500).send({ message: errorMessage })
  }
})

// POST novo cliente
app.post('/clients', async (request, reply) => {
  const data = bodySchema.parse(request.body)

  const client = await prisma.client.create({
    data,
  })

  return reply.status(201).send(client)
})

// PUT atualizar cliente
app.put('/clients/:id', async (request, reply) => {
  const { id } = paramsSchema.parse(request.params)
  const data = bodySchema.parse(request.body)

  const client = await prisma.client.update({
    where: { id },
    data,
  })

  return reply.send(client)
})

// DELETE cliente
app.delete('/clients/:id', async (request, reply) => {
  const { id } = paramsSchema.parse(request.params)

  try {
    await prisma.client.delete({
      where: { id },
    })
    return reply.status(204).send()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir cliente'
    return reply.status(500).send({ message: errorMessage })
  }
})

// GET lista de ativos mockados (com inserção no banco se quiser evoluir)
app.get('/assets', async () => {
  return {
    data: [
      { id: 1, name: 'Tesouro Direto', type: 'Renda Fixa', symbol: 'TD', price: 1000 },
      { id: 2, name: 'Ação PETR4', type: 'Renda Variável', symbol: 'PETR4', price: 35.67 },
      { id: 3, name: 'CDB Banco X', type: 'Renda Fixa', symbol: 'CDBX', price: 1200 },
    ],
  }
})

// POST alocar ativo para cliente
app.post('/clients/:id/assets', async (request, reply) => {
  const { id: clientId } = paramsSchema.parse(request.params)

  const allocationSchema = z.object({
    assetId: z.number(),
    quantity: z.number().min(1),
  })

  const { assetId, quantity } = allocationSchema.parse(request.body)

  try {
    const client = await prisma.client.findUnique({ where: { id: clientId } })
    if (!client) return reply.status(404).send({ message: 'Cliente não encontrado' })

    // Como os ativos são mockados e não salvos no banco, criamos apenas o relacionamento.
    await prisma.clientAsset.create({
      data: {
        clientId,
        assetId,
        
      },
    })

    return reply.status(201).send({ message: 'Ativo alocado com sucesso' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao alocar ativo'
    return reply.status(500).send({ message: errorMessage })
  }
})

// DELETE todos os ativos de um cliente (antes de atualizar)
app.delete('/clients/:id/assets', async (request, reply) => {
  const { id: clientId } = paramsSchema.parse(request.params)

  try {
    await prisma.clientAsset.deleteMany({
      where: { clientId },
    })

    return reply.status(204).send()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao deletar ativos'
    return reply.status(500).send({ message: errorMessage })
  }
})

// Iniciar o servidor
app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`🚀 Server running at ${address}`)
})

