// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const asset1 = await prisma.asset.create({
    data: {
      name: 'Tesouro IPCA+ 2029',
      value: 1234.56,
    },
  })

  const asset2 = await prisma.asset.create({
    data: {
      name: 'Tesouro Prefixado 2027',
      value: 987.65,
    },
  })

  console.log('Ativos criados:', asset1, asset2)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
