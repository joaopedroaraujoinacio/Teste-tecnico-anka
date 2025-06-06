import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function clientRoutes(app: FastifyInstance) {
  app.get('/clients', async () => {
    const clients = await prisma.client.findMany()
    return { data: clients } // lista ainda dentro de "data"
  })

  app.get('/clients/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    const client = await prisma.client.findUnique({
      where: { id: Number(id) },
    })

    if (!client) {
      return reply.status(404).send({ message: 'Cliente não encontrado' })
    }

    return client // ✅ retorna o objeto direto
  })

  app.post('/clients', async (request) => {
    const { name, email, status } = request.body as {
      name: string
      email: string
      status: boolean
    }

    const newClient = await prisma.client.create({
      data: { name, email, status },
    })

    return newClient
  })

  app.put('/clients/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { name, email, status } = request.body as {
      name: string
      email: string
      status: boolean
    }

    const updatedClient = await prisma.client.update({
      where: { id: Number(id) },
      data: { name, email, status },
    })

    return updatedClient
  })

  app.delete('/clients/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    await prisma.client.delete({
      where: { id: Number(id) },
    })

    return reply.status(204).send()
  })
}
