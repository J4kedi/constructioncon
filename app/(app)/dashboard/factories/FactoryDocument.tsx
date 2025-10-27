'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/app/ui/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/components/Card';
import { Input } from '@/app/ui/components/Input';
import { Label } from '@/app/ui/components/Label';
import { toast } from '@/app/ui/components/hooks/use-toast';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

interface Documento {
  id: number;
  tipo: string;
  autor: string;
  conteudo: string;
  dataEmissao: string;
  anexos: { name: string; url: string }[];
  projetoId?: number | null;
  enviado?: boolean;
}

interface Projeto {
  id: number;
  nome: string;
}

export default function DocumentosDashboard() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [tipo, setTipo] = useState('');
  const [autor, setAutor] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [dataEmissao, setDataEmissao] = useState('');
  const [anexos, setAnexos] = useState<FileList | null>(null);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/documentos')
      .then(res => res.json())
      .then(setDocumentos);

    fetch('/api/projetos')
      .then(res => res.json())
      .then(setProjetos);
  }, []);

  async function handleSalvar() {
    if (!tipo || !autor || !conteudo || !dataEmissao) {
      toast({ title: 'Campos obrigatórios', description: 'Preencha todos os campos.', variant: 'destructive' });
      return;
    }

    const anexosArray = anexos ? Array.from(anexos).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
    })) : [];

    const novoDoc = {
      tipo,
      autor,
      conteudo,
      dataEmissao,
      anexos: anexosArray,
      projetoId: null,
    };

    await fetch('/api/documentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoDoc),
    });

    toast({ title: 'Documento salvo', description: 'Documento criado com sucesso!' });
    setShowForm(false);
    setTipo('');
    setAutor('');
    setConteudo('');
    setDataEmissao('');
    setAnexos(null);

    const res = await fetch('/api/documentos');
    setDocumentos(await res.json());
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Documentos</h1>

      {documentos.map(doc => (
        <Card key={doc.id}>
          <CardHeader>
            <CardTitle>{doc.tipo}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Autor:</strong> {doc.autor}</p>
            <p><strong>Conteúdo:</strong> {doc.conteudo}</p>
            <p><strong>Data:</strong> {new Date(doc.dataEmissao).toLocaleDateString()}</p>
            {doc.anexos?.length > 0 && (
              <ul>
                {doc.anexos.map((a, i) => (
                  <li key={i}><a href={a.url} download>{a.name}</a></li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ))}

      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="mt-4">
          <Plus className="w-4 h-4 mr-2" /> Novo Documento
        </Button>
      )}

      {showForm && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Adicionar Documento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Tipo</Label>
              <Input value={tipo} onChange={e => setTipo(e.target.value)} />
            </div>
            <div>
              <Label>Autor</Label>
              <Input value={autor} onChange={e => setAutor(e.target.value)} />
            </div>
            <div>
              <Label>Conteúdo</Label>
              <Input value={conteudo} onChange={e => setConteudo(e.target.value)} />
            </div>
            <div>
              <Label>Data de Emissão</Label>
              <Input type="date" value={dataEmissao} onChange={e => setDataEmissao(e.target.value)} />
            </div>
            <div>
              <Label>Anexos</Label>
              <Input type="file" multiple onChange={e => setAnexos(e.target.files)} />
            </div>
            <Button onClick={handleSalvar}>Salvar</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              <X className="w-4 h-4 mr-1" /> Cancelar
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
