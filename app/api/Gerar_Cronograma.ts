import { NextApiRequest, NextApiResponse } from 'next';
import { Cronograma_Factory } from '@/ui/factories/Cronograma_Factory';

// Endpoint de API para criação de cronogramas
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });

  try {
    const { tipo, atividades } = req.body;

    // cria cronograma usando a factory
    const cronograma = Cronograma_Factory.criar(tipo, atividades);

    // retorna em formato JSON
    return res.status(200).json({ cronograma: cronograma.toJSON() });
  } catch (err: any) {
    return res.status(400).json({ erro: err.message });
  }
}
