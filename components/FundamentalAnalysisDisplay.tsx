
import React from 'react';
import { FundamentalMetricsData, FundamentalMetric } from '../types';
import { ptBR } from '../translations';

interface FundamentalAnalysisDisplayProps {
  metrics: FundamentalMetricsData;
}

const MetricItem: React.FC<{ metric: FundamentalMetric }> = ({ metric }) => (
  <div className="py-2 px-3 bg-slate-700/50 rounded-md">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-slate-300">{metric.name}:</span>
      <span className="text-sm font-semibold text-sky-300">{String(metric.value)}</span>
    </div>
    {metric.interpretation && (
      <p className="text-xs text-slate-400 mt-1">{metric.interpretation} {metric.threshold && `(${metric.threshold})`}</p>
    )}
  </div>
);

export const FundamentalAnalysisDisplay: React.FC<FundamentalAnalysisDisplayProps> = ({ metrics }) => {
  const displayMetrics: FundamentalMetric[] = [
    metrics.marketCap,
    metrics.peRatio,
    metrics.pegRatio,
    metrics.pbRatio,
    metrics.eps,
    metrics.roe,
    metrics.debtToEquity,
    metrics.currentRatio,
    metrics.dividendYield, // Added
  ].filter(m => m); 

  return (
    <div className="space-y-3">
      <h4 className="text-xl font-semibold text-indigo-400 mb-3">{ptBR.fundamentalMetrics}</h4>
      <div className="space-y-2">
        {displayMetrics.map((metric) => (
          metric ? <MetricItem key={metric.name} metric={metric} /> : null
        ))}
      </div>
    </div>
  );
};
