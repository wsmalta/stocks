
import React from 'react';
import { StockFullAnalysis } from '../types'; // Using StockFullAnalysis for structure consistency
import { ptBR } from '../translations';

interface MostTradedTableProps {
  usStocks: StockFullAnalysis[];
  brStocks: StockFullAnalysis[];
}

const StockRow: React.FC<{ stock: StockFullAnalysis }> = ({ stock }) => {
  // Simulate daily change - in a real app, this would come from an API
  const mockDailyChange = (Math.random() * 5 - 2.5).toFixed(2); // Random % between -2.5 and +2.5
  const changeColor = parseFloat(mockDailyChange) >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <tr className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
      <td className="py-3 px-4 text-sm text-sky-300 font-medium">{stock.ticker}</td>
      <td className="py-3 px-4 text-sm text-slate-300">{stock.companyName}</td>
      <td className={`py-3 px-4 text-sm font-semibold ${changeColor}`}>{parseFloat(mockDailyChange) >=0 ? '+' : ''}{mockDailyChange}%</td>
    </tr>
  );
};

const MarketTable: React.FC<{ title: string; stocks: StockFullAnalysis[] }> = ({ title, stocks }) => (
  <div className="bg-slate-800 p-6 rounded-xl shadow-xl">
    <h3 className="text-xl font-semibold text-sky-400 mb-4">{title}</h3>
    {stocks.length > 0 ? (
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left text-xs text-slate-400 uppercase">
            <th className="py-2 px-4">{ptBR.tableHeaderTicker}</th>
            <th className="py-2 px-4">{ptBR.tableHeaderCompany}</th>
            <th className="py-2 px-4">{ptBR.tableHeaderDailyChange}</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(stock => <StockRow key={stock.ticker} stock={stock} />)}
        </tbody>
      </table>
    ) : (
      <p className="text-slate-400">{ptBR.loadingAnalysis}...</p> // Or "No data available"
    )}
  </div>
);

export const MostTradedTable: React.FC<MostTradedTableProps> = ({ usStocks, brStocks }) => {
  return (
    <section className="mb-10">
      <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500 mb-8">
        {ptBR.mostTradedStocksTitle}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MarketTable title={ptBR.usMarket} stocks={usStocks} />
        <MarketTable title={ptBR.brMarket} stocks={brStocks} />
      </div>
    </section>
  );
};
