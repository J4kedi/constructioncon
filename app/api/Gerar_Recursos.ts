import type { NextApiRequest, NextApiResponse } from 'next';
import { Recursos_Factory } from '../dashboard/factories/recursos_factory';

export default function ligar(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { tipo, quantidade, nomeMaterial, nomeEquipamento,} = req.body;

    try {
      const recurso = Recursos_Factory.criar({
        tipo,
        quantidade,
        nomeMaterial,
        nomeEquipamento,
      });

      res.status(200).json({ recurso });
    } catch (error) {
      res.status(400).json({
        erro: 'Tipo de recurso inválido ou dados incompletos',
      });
    }
  } else {
    res.status(405).json({ erro: 'Método não permitido' });
  }
}
