import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { descricao, responsavel, inicio, fim } = req.body

    if (!descricao || !responsavel || !inicio || !fim) {
      return res.status(400).json({ error: 'Dados incompletos' })
    }

    const inicioDate = new Date(inicio)
    const fimDate = new Date(fim)

    if (isNaN(inicioDate.getTime()) || isNaN(fimDate.getTime())) {
      return res.status(400).json({ error: 'Datas inválidas' })
    }

    const duracaoDias = Math.ceil((fimDate.getTime() - inicioDate.getTime()) / (1000 * 60 * 60 * 24))

    const atividade = await prisma.atividade_Cronograma.create({
  data: {
    descricao,
    responsavel,
    inicio: inicioDate,
    fim: fimDate,
    duracaoDias,
  },
})


    return res.status(201).json(atividade)
  } catch (error: any) {
    console.error('Erro ao salvar no Prisma:', error.message, error)
    return res.status(500).json({ error: error.message || 'Erro interno ao salvar atividade' })
  }
}
