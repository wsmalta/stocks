
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="my-6 p-4 bg-red-700/30 border border-red-500/50 text-red-300 rounded-md shadow-md text-center">
      <p className="font-semibold">Erro</p>
      <p>{message}</p>
    </div>
  );
};