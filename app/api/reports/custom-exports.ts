import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const featureKeysHeader = req.headers['x-tenant-features'] as string | undefined;
    const activeFeatures = featureKeysHeader?.split(',') || [];

    const hasFeature = (key: string) => activeFeatures.includes(key);

    if (!hasFeature('reports-custom-export')) {
        return res.status(403).json({ error: 'Acesso negado. Funcionalidade não ativada.' });
    }

    res.status(200).json({ 
        message: 'Relatório customizado gerado com sucesso!',
        tenantId: req.headers['x-tenant-id'],
    });
}