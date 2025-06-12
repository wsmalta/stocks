
import React, { useState } from 'react';
import { MAX_TICKERS } from '../constants';
import { ptBR } from '../translations';

interface TickerInputProps {
  onAnalyze: (tickers: string, startDate: string) => void;
  initialStartDate: string;
  isLoading: boolean;
}

export const TickerInput: React.FC<TickerInputProps> = ({ onAnalyze, initialStartDate, isLoading }) => {
  const [tickers, setTickers] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(initialStartDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(tickers, startDate);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="tickers" className="block text-sm font-medium text-sky-300 mb-1">
          {ptBR.tickerInputLabel(MAX_TICKERS)}
        </label>
        <input
          type="text"
          id="tickers"
          value={tickers}
          onChange={(e) => setTickers(e.target.value)}
          placeholder="ex: AAPL, MSFT, PETR4, VALE3"
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-gray-100 placeholder-slate-400"
          disabled={isLoading}
          aria-label={ptBR.tickerInputLabel(MAX_TICKERS)}
        />
      </div>
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-sky-300 mb-1">
          {ptBR.startDateLabel}
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-gray-100"
          max={new Date().toISOString().split('T')[0]} // Cannot select future date
          disabled={isLoading}
          aria-label={ptBR.startDateLabel}
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {ptBR.analyzingButton}
          </>
        ) : (
          ptBR.analyzeButton
        )}
      </button>
    </form>
  );
};
