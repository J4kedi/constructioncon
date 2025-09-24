import { NextApiRequest, NextApiResponse } from 'next';
import { Recursos_Factory } from '@/ui/factories/Recursos_Factory';

// Endpoint de API para criação de recursos
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });

  try {
    const { tipo, quantidade, nomeMaterial, nomeEquipamento, funcao } = req.body;

    // cria recurso usando a factory
    const recurso = Recursos_Factory.criar({ tipo, quantidade, nomeMaterial, nomeEquipamento, funcao });

    // retorna em formato JSON
    return res.status(200).json({ recurso: recurso.toJSON() });
  } catch (err: any) {
    return res.status(400).json({ erro: err.message });
  }
}
