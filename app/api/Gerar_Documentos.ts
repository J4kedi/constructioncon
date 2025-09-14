import type { NextApiRequest, NextApiResponse } from 'next';
import { Document_Factory } from '../ui/factories/Document_Factory';

export default function ligar(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { tipo, conteudo, autor, anexos } = req.body;

    try {
      const documento = Document_Factory.criar(
        tipo,
        new Date(),
        conteudo,
        autor,
        anexos
      );

      res.status(200).json({ documento });
    } catch (error) {
      res.status(400).json({
        erro: 'Tipo de documento inválido ou dados incompletos.',
      });
    }
  } else {
    res.status(405).json({ mensagem: 'Método não permitido' });
  }
}
