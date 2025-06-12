
import React from 'react';
import { TechnicalIndicatorsData } from '../types';
import { ptBR } from '../translations';

interface TechnicalIndicatorsDisplayProps {
  indicators: TechnicalIndicatorsData;
}

export const TechnicalIndicatorsDisplay: React.FC<TechnicalIndicatorsDisplayProps> = ({ indicators }) => {
  const { smas, rsi, macd, bollingerBands } = indicators;

  return (
    <div className="space-y-3">
      <h4 className="text-xl font-semibold text-indigo-400 mb-3">{ptBR.keyTechnicalIndicators}</h4>
      
      <div className="p-3 bg-slate-700/50 rounded-md">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-300">{ptBR.rsiTitle(rsi.period)}:</span>
          <span className="text-sm font-semibold text-sky-300">{rsi.value !== null ? rsi.value.toFixed(2) : 'N/A'}</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">{rsi.interpretation}</p>
      </div>

      <div className="p-3 bg-slate-700/50 rounded-md">
        <p className="text-sm font-medium text-slate-300 mb-1">{ptBR.macdTitle}:</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between"><span>{ptBR.macdLine}:</span> <span className="text-sky-300">{macd.values.macdLine?.toFixed(2) ?? 'N/A'}</span></div>
          <div className="flex justify-between"><span>{ptBR.signalLine}:</span> <span className="text-sky-300">{macd.values.signalLine?.toFixed(2) ?? 'N/A'}</span></div>
          <div className="flex justify-between"><span>{ptBR.histogram}:</span> <span className="text-sky-300">{macd.values.histogram?.toFixed(2) ?? 'N/A'}</span></div>
        </div>
        <p className="text-xs text-slate-400 mt-1">{macd.interpretation}</p>
      </div>
      
      <div className="p-3 bg-slate-700/50 rounded-md">
         <p className="text-sm font-medium text-slate-300 mb-1">{ptBR.movingAveragesLast}:</p>
         {smas.map(sma => (
          <div key={sma.period} className="flex justify-between items-center text-xs">
            <span className="text-slate-300">{ptBR.smaDay(sma.period)}:</span>
            <span className="text-sky-300">{sma.value !== null ? sma.value.toFixed(2) : 'N/A'}</span>
          </div>
         ))}
      </div>

      <div className="p-3 bg-slate-700/50 rounded-md">
        <p className="text-sm font-medium text-slate-300 mb-1">{ptBR.bollingerBands}:</p>
        <div className="space-y-1 text-xs">
            <div className="flex justify-between"><span>{ptBR.bbUpper}:</span> <span className="text-sky-300">{bollingerBands.values.upperBand?.toFixed(2) ?? 'N/A'}</span></div>
            <div className="flex justify-between"><span>{ptBR.bbMiddle}:</span> <span className="text-sky-300">{bollingerBands.values.middleBand?.toFixed(2) ?? 'N/A'}</span></div>
            <div className="flex justify-between"><span>{ptBR.bbLower}:</span> <span className="text-sky-300">{bollingerBands.values.lowerBand?.toFixed(2) ?? 'N/A'}</span></div>
        </div>
        <p className="text-xs text-slate-400 mt-1">{bollingerBands.interpretation}</p>
      </div>
    </div>
  );
};
