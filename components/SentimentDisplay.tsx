
import React, { useState } from 'react';
import { StockSentimentReport, HeadlineSentiment, Sentiment } from '../types';
import { SENTIMENT_ICON, SENTIMENT_TEXT_COLOR, SENTIMENT_BG_COLOR } from '../constants';

interface SentimentDisplayProps {
  reports: StockSentimentReport[];
}

const SentimentCard: React.FC<{ report: StockSentimentReport }> = ({ report }) => {
  const [showHeadlines, setShowHeadlines] = useState(false);

  return (
    <div className={`p-5 rounded-lg border ${SENTIMENT_BG_COLOR[report.overallSentiment]} shadow-lg transition-all duration-300 ease-in-out`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-2xl font-semibold text-gray-100">{report.ticker}</h3>
        <div className={`flex items-center text-lg font-medium ${SENTIMENT_TEXT_COLOR[report.overallSentiment]}`}>
          <span className="mr-2 text-2xl">{SENTIMENT_ICON[report.overallSentiment]}</span>
          {report.overallSentiment}
        </div>
      </div>
      
      {report.headlines.length > 0 && (
         <button 
            onClick={() => setShowHeadlines(!showHeadlines)}
            className="text-sm text-sky-400 hover:text-sky-300 mb-3"
          >
            {showHeadlines ? 'Ocultar' : 'Mostrar'} Manchetes de Exemplo ({report.headlines.length})
          </button>
      )}

      {showHeadlines && (
        <div className="mt-3 space-y-2 pl-4 border-l-2 border-slate-600">
          {report.headlines.map((headline, index) => (
            <div key={index} className="text-sm">
              <p className="text-slate-300">{headline.text}</p>
              <p className={`text-xs font-medium ${SENTIMENT_TEXT_COLOR[headline.sentiment]}`}>Sentimento: {headline.sentiment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export const SentimentDisplay: React.FC<SentimentDisplayProps> = ({ reports }) => {
  if (reports.length === 0) {
    return null; 
  }

  return (
    <section className="p-6 bg-slate-800 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
        Análise de Sentimento de Notícias por IA
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <SentimentCard key={report.ticker} report={report} />
        ))}
      </div>
    </section>
  );
};