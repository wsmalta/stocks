
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../types';
import { CHART_COLORS } from '../constants';
import { ptBR } from '../translations';

interface PriceChartProps {
  data: ChartDataPoint[];
  tickers: string[];
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, tickers }) => {
  if (data.length === 0) {
    return null;
  }

  return (
    <section className="p-6 bg-slate-800 rounded-xl shadow-2xl h-[500px]">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
        {ptBR.historicalPrices}
      </h2>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} stroke="#94a3b8" />
          <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            domain={['auto', 'auto']}
            tickFormatter={(value) => `R$${Number(value).toFixed(2)}`} // Assuming BRL, adjust if mixed currencies
            // For mixed currencies, this might need to be more dynamic or generic (e.g. just the number)
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid #475569', borderRadius: '0.5rem', color: '#e2e8f0' }}
            itemStyle={{ color: '#e2e8f0' }}
            cursor={{ stroke: '#60a5fa', strokeWidth: 1, strokeDasharray: '3 3' }}
            formatter={(value: number, name: string) => [`R$${value.toFixed(2)}`, name]} // Assuming BRL
          />
          <Legend wrapperStyle={{ color: '#e2e8f0', paddingTop: '10px' }} />
          {tickers.map((ticker, index) => (
            <Line
              key={ticker}
              type="monotone"
              dataKey={ticker}
              stroke={CHART_COLORS[index % CHART_COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
};
