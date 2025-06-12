
import React from 'react';
import { ptBR } from '../../translations';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-10" role="status" aria-live="polite">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-500"></div>
      <p className="ml-4 text-xl text-slate-300">{ptBR.loadingAnalysis}</p>
    </div>
  );
};
