import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/app/lib/prisma'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { id, descricao, responsavel, inicio, fim } = req.body;

  if (!id || !descricao || !responsavel || !inicio || !fim) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  try {
    const atividadeAtualizada = await prisma.atividade.update({
      where: { id },
      data: { descricao, responsavel, inicio, fim },
    });

    return res.status(200).json(atividadeAtualizada);
  } catch (error) {
    console.error('Erro ao editar atividade:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
