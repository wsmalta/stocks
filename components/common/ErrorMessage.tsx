
import React from 'react';
import { ptBR } from '../../translations';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="my-6 p-4 bg-red-700/30 border border-red-500/50 text-red-300 rounded-md shadow-md text-center" role="alert">
      <p className="font-semibold">{ptBR.errorPrefix}</p>
      <p>{message}</p>
    </div>
  );
};
