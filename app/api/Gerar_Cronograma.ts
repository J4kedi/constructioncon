import type { NextApiRequest, NextApiResponse } from 'next';
import { Cronograma_Factory } from '../dashboard/factories_cronograma_recursos/cronograma_factory';

export default function ligar(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { tipo, Date, atividades } = req.body;

    try {
      const cronograma = Cronograma_Factory.criar(
        tipo,
        new Date(),
        atividades
      );

      res.status(200).json({ cronograma });
    } catch (error) {
      res.status(400).json({
        erro: 'Tipo de cronograma inválido ou dados incompletos',
      });
    }
  } else {
    res.status(405).json({ erro: 'Método não permitido' });
  }
}
