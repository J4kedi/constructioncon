'use client';

import { useState } from 'react';
import { runScriptAction } from '@/app/actions/scripts.actions';
import { Terminal, Play } from 'lucide-react';

interface ScriptCardWithTwoArgumentsProps {
  scriptKey: string;
  description: string;
  arg1Placeholder: string;
  arg2Placeholder: string;
}

export default function ScriptCardWithTwoArguments({ 
  scriptKey, 
  description, 
  arg1Placeholder,
  arg2Placeholder
}: ScriptCardWithTwoArgumentsProps) {
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [arg1, setArg1] = useState('');
  const [arg2, setArg2] = useState('');

  const handleRunScript = async () => {
    if (!arg1 || !arg2) {
      setOutput('Erro: Ambos os argumentos são obrigatórios.');
      setError(true);
      return;
    }
    setIsLoading(true);
    setOutput('');
    setError(false);

    const fullScriptKey = `${scriptKey} "${arg1}" "${arg2}"`;
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
      
      <div className="space-y-4">
        <input
          type="text"
          value={arg1}
          onChange={(e) => setArg1(e.target.value)}
          placeholder={arg1Placeholder}
          className="w-full p-2 rounded-md bg-secondary/20 border-transparent focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <input
          type="text"
          value={arg2}
          onChange={(e) => setArg2(e.target.value)}
          placeholder={arg2Placeholder}
          className="w-full p-2 rounded-md bg-secondary/20 border-transparent focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleRunScript}
          disabled={isLoading || !arg1 || !arg2}
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
