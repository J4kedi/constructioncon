'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/ui/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/components/Card';
import { Input } from '@/app/ui/components/Input';
import { Label } from '@/app/ui/components/Label';
import { toast } from '@/app/ui/components/hooks/use-toast';
import { FileText, Plus, Edit2, Trash2, X } from 'lucide-react';

interface Documento {
  id: string;
  tipo: string;
  autor: string;
  conteudo: string;
  dataEmissao: string;
  anexos: { name: string; url: string }[];
}

export default function DocumentosDashboard() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [tipo, setTipo] = useState('');
  const [autor, setAutor] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [dataEmissao, setDataEmissao] = useState('');
  const [idEditando, setIdEditando] = useState<string | null>(null);
  const [anexos, setAnexos] = useState<FileList | null>(null);
  const [erroAnexo, setErroAnexo] = useState<string | null>(null);

  useEffect(() => {
    const docsSalvos = localStorage.getItem('documentos');
    if (docsSalvos) setDocumentos(JSON.parse(docsSalvos));
  }, []);

  function salvarDocumentos(novosDocs: Documento[]) {
    localStorage.setItem('documentos', JSON.stringify(novosDocs));
    setDocumentos(novosDocs);
  }

  function handleSalvar() {
    if (!tipo || !autor || !conteudo || !dataEmissao) {
      toast({ title: 'Campos obrigatórios', description: 'Preencha todos os campos.', variant: 'destructive' });
      return;
    }

    const novoDoc: Documento = {
      id: idEditando || `doc-${Date.now()}`,
      tipo,
      autor,
      conteudo,
      dataEmissao,
      anexos: anexos ? Array.from(anexos).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })) : [],
    };

    if (idEditando) {
      salvarDocumentos(documentos.map(d => d.id === idEditando ? novoDoc : d));
      toast({ title: 'Sucesso!', description: 'Documento atualizado com sucesso!' });
    } else {
      salvarDocumentos([...documentos, novoDoc]);
      toast({ title: 'Sucesso!', description: 'Documento adicionado com sucesso!' });
    }

    limparFormulario();
  }

  function limparFormulario() {
    setIdEditando(null);
    setTipo('');
    setAutor('');
    setConteudo('');
    setDataEmissao('');
    setAnexos(null);
    setErroAnexo(null);
    setShowForm(false);
  }

  function preencherFormulario(doc: Documento) {
    setIdEditando(doc.id);
    setTipo(doc.tipo);
    setAutor(doc.autor);
    setConteudo(doc.conteudo);
    setDataEmissao(doc.dataEmissao);
    setShowForm(true);
  }

  function handleExcluir(id: string, tipo: string) {
    if (confirm(`Deseja realmente excluir o documento "${tipo}"?`)) {
      salvarDocumentos(documentos.filter(d => d.id !== id));
      toast({ title: 'Documento excluído', description: 'O documento foi removido com sucesso.' });
    }
  }

  function handleAnexosChange(event: React.ChangeEvent<HTMLInputElement>) {
    const arquivos = event.target.files;
    if (!arquivos) return;

    const validos = Array.from(arquivos).filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      return ext && ["pdf","doc","docx","xls","xlsx","png","jpg","jpeg"].includes(ext);
    });

    if (validos.length !== arquivos.length) {
      setErroAnexo("Só são aceitos arquivos PDF, Word, Excel ou imagens (PNG, JPG).");
      setAnexos(null);
    } else {
      setErroAnexo(null);
      const dt = new DataTransfer();
      validos.forEach(f => dt.items.add(f));
      setAnexos(dt.files);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="text-center space-y-2 mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FileText className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">Gerenciador de Documentos</h1>
          </div>
          <p className="text-muted-foreground">Crie, edite e gerencie seus documentos</p>
        </header>

        {documentos.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Documentos Cadastrados</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {documentos.map(doc => (
                  <li key={doc.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-lg border hover:shadow-md transition-all">
                    <div className="flex-1">
                      <p className="font-semibold">{doc.tipo}</p>
                      <p className="text-sm opacity-70">Autor: {doc.autor}</p>
                      <p className="text-sm opacity-70">Data: {doc.dataEmissao}</p>
                      <p className="text-sm opacity-70">Conteúdo: {doc.conteudo}</p>

                      {doc.anexos.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Anexos:</p>
                          <ul className="list-disc list-inside text-sm">
                            {doc.anexos.map((arquivo, i) => (
                              <li key={i}>
                                <a href={arquivo.url} download={arquivo.name} className="text-primary underline hover:text-primary/80">
                                  {arquivo.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => preencherFormulario(doc)}><Edit2 className="w-4 h-4" /></Button>
                      <Button variant="destructive" size="icon" onClick={() => handleExcluir(doc.id, doc.tipo)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {!showForm && (
          <div className="flex justify-center">
            <Button onClick={() => setShowForm(true)} className="gap-2"><Plus className="w-4 h-4" />Novo Documento</Button>
          </div>
        )}

        {showForm && (
          <Card>
            <CardHeader><CardTitle>{idEditando ? 'Editar Documento' : 'Adicionar Documento'}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label htmlFor="tipo">Tipo</Label><Input id="tipo" value={tipo} onChange={e => setTipo(e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="autor">Autor</Label><Input id="autor" value={autor} onChange={e => setAutor(e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="conteudo">Conteúdo</Label><Input id="conteudo" value={conteudo} onChange={e => setConteudo(e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="dataEmissao">Data de Emissão</Label><Input type="date" id="dataEmissao" value={dataEmissao} onChange={e => setDataEmissao(e.target.value)} /></div>
                            <div className="space-y-2">
                <Label htmlFor="anexos">Anexos</Label>
                <Input
                  id="anexos"
                  type="file"
                  multiple
                  onChange={handleAnexosChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                             file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {erroAnexo && (
                  <p className="text-sm text-destructive">{erroAnexo}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSalvar}>
                  {idEditando ? 'Atualizar' : 'Salvar'}
                </Button>
                <Button variant="outline" onClick={limparFormulario}>
                  <X className="w-4 h-4 mr-1" /> Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
