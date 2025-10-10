import type { NextApiRequest, NextApiResponse } from 'next';
import { Cronograma_Factory } from '../dashboard/factories/cronograma_factory';

export default async function ligar(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido. Use POST.' });
  }

  const { tipo, dataEntrega, atividades } = req.body;

  if (
    !tipo ||
    !dataEntrega ||
    !atividades ||
    !Array.isArray(atividades) ||
    atividades.length === 0
  ) {
    return res.status(400).json({
      erro: 'Dados incompletos. Envie tipo, dataEntrega e uma lista de atividades.',
    });
  }

  try {
    const entregaDate = new Date(dataEntrega);
    if (isNaN(entregaDate.getTime())) {
      throw new Error('Data de entrega inválida');
    }

    const cronograma = Cronograma_Factory.criar(tipo, entregaDate, atividades);

    return res.status(200).json({ cronograma });
  } catch (error: any) {
    console.error('Erro ao criar cronograma:', error);
    return res.status(400).json({
      erro: error.message || 'Erro interno ao gerar cronograma.',
    });
  }
}
