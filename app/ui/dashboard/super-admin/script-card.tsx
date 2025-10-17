
'use client';

import { useState } from 'react';
import { runScriptAction } from '@/app/actions/scripts.actions';
import { Terminal, Play } from 'lucide-react';

interface Argument {
  name: string;
  placeholder: string;
}

interface ScriptCardProps {
  scriptKey: string;
  description: string;
  args?: Argument[];
}

export default function ScriptCard({ scriptKey, description, args = [] }: ScriptCardProps) {
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [argValues, setArgValues] = useState<Record<string, string>>({});

  const handleArgChange = (name: string, value: string) => {
    setArgValues(prev => ({ ...prev, [name]: value }));
  };

  const areAllArgsFilled = () => {
    return args.every(arg => argValues[arg.name]?.trim() !== '');
  };

  const handleRunScript = async () => {
    if (args.length > 0 && !areAllArgsFilled()) {
      setOutput('Erro: Todos os argumentos são obrigatórios.');
      setError(true);
      return;
    }
    setIsLoading(true);
    setOutput('');
    setError(false);

    const scriptArgs = args.map(arg => `"${argValues[arg.name]}"`).join(' ');
    const fullScriptKey = `${scriptKey} ${scriptArgs}`.trim();
    
    const result = await runScriptAction(fullScriptKey);

    setOutput(result.output);
    setError(!result.success);
    setIsLoading(false);
  };

  const isButtonDisabled = isLoading || (args.length > 0 && !areAllArgsFilled());

  return (
    <div className="bg-background border border-secondary/20 rounded-lg p-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-text">{scriptKey}</h3>
        <p className="text-sm text-text/70 mt-1">{description}</p>
      </div>
      
      {args.length > 0 && (
        <div className="space-y-4">
          {args.map(arg => (
            <input
              key={arg.name}
              type="text"
              value={argValues[arg.name] || ''}
              onChange={(e) => handleArgChange(arg.name, e.target.value)}
              placeholder={arg.placeholder}
              className="w-full p-2 rounded-md bg-secondary/20 border-transparent focus:ring-2 focus:ring-primary focus:outline-none"
            />
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleRunScript}
          disabled={isButtonDisabled}
          className="flex items-center gap-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-md disabled:bg-gray-500 disabled:cursor-not-allowed cursor-pointer"
        >
          <Play size={16} />
          {isLoading ? 'Executando...' : 'Executar'}
        </button>
      </div>

      {output && (
        <div className="mt-4 p-4 bg-black rounded-md font-mono text-sm text-white overflow-x-auto">
          <div className="flex items-center gap-2 border-b border-gray-700 pb-2 mb-2">
            <Terminal size={16} />
            <span className="font-semibold">Saída do Terminal</span>
          </div>
          <pre className={`whitespace-pre-wrap ${error ? 'text-red-400' : 'text-green-400'}`}>
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
