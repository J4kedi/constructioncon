'use client';

import { useState } from 'react';
import { runScriptAction } from '@/app/actions/scripts.actions';
import { Terminal, Play } from 'lucide-react';

interface ScriptCardWithArgumentProps {
  scriptKey: string;
  description: string;
  argName: string;
  argPlaceholder: string;
}

export default function ScriptCardWithArgument({ scriptKey, description, argName, argPlaceholder }: ScriptCardWithArgumentProps) {
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [argument, setArgument] = useState('');

  const handleRunScript = async () => {
    if (!argument) {
      setOutput('Erro: O argumento é obrigatório.');
      setError(true);
      return;
    }
    setIsLoading(true);
    setOutput('');
    setError(false);

    const fullScriptKey = `${scriptKey} "${argument}"`;
    const result = await runScriptAction(fullScriptKey);

    setOutput(result.output);
    setError(!result.success);
    setIsLoading(false);
  };

  return (
    <div className="bg-background border border-secondary/20 rounded-lg p-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-text">{scriptKey}</h3>
        <p className="text-sm text-text/70 mt-1">{description}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={argument}
          onChange={(e) => setArgument(e.target.value)}
          placeholder={argPlaceholder}
          className="flex-grow p-2 rounded-md bg-secondary/20 border-transparent focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <button
          onClick={handleRunScript}
          disabled={isLoading || !argument}
          className="flex items-center gap-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-md disabled:bg-gray-500 disabled:cursor-not-allowed"
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