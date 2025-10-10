import type { NextApiRequest, NextApiResponse } from 'next';
import { Cronograma_Factory } from '../dashboard/factories/cronograma_factory';

export default function ligar(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido. Use POST.' });
  }

  const { tipo, dataEntrega, atividades } = req.body;

  if (!tipo || !dataEntrega || !atividades || !Array.isArray(atividades)) {
    return res.status(400).json({
      erro: 'Dados incompletos. Certifique-se de enviar tipo, dataEntrega e atividades.',
    });
  }

  try {
    const cronograma = Cronograma_Factory.criar(
      tipo,
      new Date(dataEntrega),
      atividades
    );

    return res.status(200).json({ cronograma });
  } catch (error) {
    console.error('Erro ao criar cronograma:', error);
    return res.status(400).json({
      erro: 'Tipo de cronograma inválido ou erro interno ao gerar cronograma.',
    });
  }
}
