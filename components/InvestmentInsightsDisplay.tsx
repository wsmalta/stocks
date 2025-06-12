// This file is now InvestmentInsightsDisplay.tsx

import React from 'react';
import { AIStockReport } from '../types';
import { ptBR } from '../translations';

interface InvestmentInsightsDisplayProps {
  reports: AIStockReport[]; // Now takes AIStockReport
}

const InsightsCard: React.FC<{ report: AIStockReport }> = ({ report }) => {
  if (!report || !report.companyOverview) { // Basic check for valid report
    return (
      <div className="p-5 rounded-lg border bg-slate-700/50 border-slate-600 shadow-lg">
        <h3 className="text-2xl font-semibold text-gray-100">{report?.ticker || "N/A"}</h3>
        <p className="text-slate-400 mt-2">{ptBR.noAIReportData}</p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-lg border bg-slate-700/50 border-slate-600 shadow-lg transition-all duration-300 ease-in-out">
      <h3 className="text-2xl font-semibold text-gray-100 mb-4">{report.ticker}</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-medium text-sky-300 mb-1">{ptBR.companyOverview}</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{report.companyOverview}</p>
        </div>
        <div>
          <h4 className="text-lg font-medium text-sky-300 mb-1">{ptBR.financialHealth}</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{report.financialHealthAnalysis}</p>
        </div>
        <div>
          <h4 className="text-lg font-medium text-sky-300 mb-1">{ptBR.investmentOutlook}</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{report.investmentOutlook}</p>
        </div>
      </div>
    </div>
  );
};

export const InvestmentInsightsDisplay: React.FC<InvestmentInsightsDisplayProps> = ({ reports }) => {
  if (!reports || reports.length === 0) {
    return null; 
  }

  return (
    <section className="p-6 bg-slate-800 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
        {ptBR.aiGeneratedAnalysis}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <InsightsCard key={report.ticker} report={report} />
        ))}
      </div>
    </section>
  );
};