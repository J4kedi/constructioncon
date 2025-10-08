'use client';

import { useState } from 'react';
import { runScriptAction } from '@/app/actions/scripts.actions';
import { Terminal, Play } from 'lucide-react';

interface ScriptCardProps {
  scriptKey: string;
  description: string;
}

export default function ScriptCard({ scriptKey, description }: ScriptCardProps) {
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleRunScript = async () => {
    setIsLoading(true);
    setOutput('');
    setError(false);

    const result = await runScriptAction(scriptKey);

    setOutput(result.output);
    setError(!result.success);
    setIsLoading(false);
  };

  return (
    <div className="bg-background border border-secondary/20 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-text">{scriptKey}</h3>
          <p className="text-sm text-text/70 mt-1">{description}</p>
        </div>
        <button
          onClick={handleRunScript}
          disabled={isLoading}
          className="flex items-center gap-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-md disabled:bg-gray-500 disabled:cursor-wait cursor-pointer"
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