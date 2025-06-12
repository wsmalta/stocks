
import React from 'react';
import { TechnicalIndicatorsData } from '../types';

interface TechnicalIndicatorsDisplayProps {
  indicators: TechnicalIndicatorsData;
}

export const TechnicalIndicatorsDisplay: React.FC<TechnicalIndicatorsDisplayProps> = ({ indicators }) => {
  const { smas, rsi, macd, bollingerBands } = indicators;

  return (
    <div className="space-y-3">
      <h4 className="text-xl font-semibold text-indigo-400 mb-3">Indicadores Técnicos Chave</h4>
      
      {/* RSI */}
      <div className="p-3 bg-slate-700/50 rounded-md">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-300">IFR ({rsi.period}-dias):</span>
          <span className="text-sm font-semibold text-sky-300">{rsi.value !== null ? rsi.value.toFixed(2) : 'N/A'}</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">{rsi.interpretation}</p>
      </div>

      {/* MACD */}
      <div className="p-3 bg-slate-700/50 rounded-md">
        <p className="text-sm font-medium text-slate-300 mb-1">MACD:</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between"><span>Linha MACD:</span> <span className="text-sky-300">{macd.values.macdLine?.toFixed(2) ?? 'N/A'}</span></div>
          <div className="flex justify-between"><span>Linha de Sinal:</span> <span className="text-sky-300">{macd.values.signalLine?.toFixed(2) ?? 'N/A'}</span></div>
          <div className="flex justify-between"><span>Histograma:</span> <span className="text-sky-300">{macd.values.histogram?.toFixed(2) ?? 'N/A'}</span></div>
        </div>
        <p className="text-xs text-slate-400 mt-1">{macd.interpretation}</p>
      </div>
      
      {/* Moving Averages (summary of last values) */}
      <div className="p-3 bg-slate-700/50 rounded-md">
         <p className="text-sm font-medium text-slate-300 mb-1">Médias Móveis (Último Valor):</p>
         {smas.map(sma => (
          <div key={sma.period} className="flex justify-between items-center text-xs">
            <span className="text-slate-300">MMS ({sma.period}-dias):</span>
            <span className="text-sky-300">{sma.value !== null ? sma.value.toFixed(2) : 'N/A'}</span>
          </div>
         ))}
      </div>

      {/* Bollinger Bands (summary of last values) */}
      <div className="p-3 bg-slate-700/50 rounded-md">
        <p className="text-sm font-medium text-slate-300 mb-1">Bandas de Bollinger® (20-dias, 2 DesvPad):</p>
        <div className="space-y-1 text-xs">
            <div className="flex justify-between"><span>Superior:</span> <span className="text-sky-300">{bollingerBands.values.upperBand?.toFixed(2) ?? 'N/A'}</span></div>
            <div className="flex justify-between"><span>Média:</span> <span className="text-sky-300">{bollingerBands.values.middleBand?.toFixed(2) ?? 'N/A'}</span></div>
            <div className="flex justify-between"><span>Inferior:</span> <span className="text-sky-300">{bollingerBands.values.lowerBand?.toFixed(2) ?? 'N/A'}</span></div>
        </div>
        <p className="text-xs text-slate-400 mt-1">{bollingerBands.interpretation}</p>
      </div>
    </div>
  );
};