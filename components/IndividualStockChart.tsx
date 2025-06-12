
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { IndividualChartDataPoint } from '../types';
import { CHART_COLORS } from '../constants';
import { ptBR } from '../translations';

interface IndividualStockChartProps {
  ticker: string;
  data: IndividualChartDataPoint[];
}

export const IndividualStockChart: React.FC<IndividualStockChartProps> = ({ ticker, data }) => {
  if (!data || data.length === 0) {
    return <p className="text-slate-400 text-center py-4">{ptBR.noDataForChart(ticker)}</p>;
  }

  const formatCurrency = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    // Assuming BRL, adjust if mixed currencies needed
    return `R$${Number(value).toFixed(2)}`;
  };
  
  const legendNameMap: {[key:string]: string} = {
    price: ptBR.price,
    sma20: ptBR.sma20,
    sma50: ptBR.sma50,
    bbUpper: ptBR.bbUpper,
    bbMiddle: ptBR.bbMiddle,
    bbLower: ptBR.bbLower,
  };

  return (
    <div className="h-[450px] mt-4 bg-slate-700/30 p-4 rounded-lg">
       <h5 className="text-lg font-semibold text-center text-slate-200 mb-4">{ptBR.individualChartTitle(ticker)}</h5>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} stroke="#94a3b8" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#94a3b8', fontSize: 11 }} 
            angle={-10}
            textAnchor="end"
            height={40}
            dy={5}
          />
          <YAxis 
            tick={{ fill: '#94a3b8', fontSize: 11 }} 
            domain={['auto', 'auto']}
            tickFormatter={(value) => formatCurrency(value)}
            yAxisId="left"
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid #475569', borderRadius: '0.5rem', color: '#e2e8f0' }}
            itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
            cursor={{ stroke: '#60a5fa', strokeWidth: 1, strokeDasharray: '3 3' }}
            formatter={(value: number, name: string) => {
                 const displayName = legendNameMap[name] || name;
                 return value !== null && value !== undefined ? [formatCurrency(value), displayName] : [null, null];
            }}
          />
          <Legend 
            wrapperStyle={{ color: '#e2e8f0', paddingTop: '10px', fontSize: '12px' }} 
            formatter={(value) => legendNameMap[value] || value}
          />

          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={CHART_COLORS[0]} 
            strokeWidth={2} 
            dot={false} 
            activeDot={{ r: 5 }} 
            yAxisId="left"
            name="price" // Keep short name for dataKey matching, formatter will translate
          />
          <Line 
            type="monotone" 
            dataKey="sma20" 
            stroke={CHART_COLORS[1]} 
            strokeWidth={1.5} 
            dot={false} 
            yAxisId="left"
            name="sma20"
          />
          <Line 
            type="monotone" 
            dataKey="sma50" 
            stroke={CHART_COLORS[2]} 
            strokeWidth={1.5} 
            dot={false} 
            yAxisId="left"
            name="sma50"
          />
           <Line 
            type="monotone" 
            dataKey="bbUpper" 
            stroke={CHART_COLORS[3]} 
            strokeDasharray="2 2"
            strokeWidth={1} 
            dot={false} 
            yAxisId="left"
            name="bbUpper"
          />
           <Line 
            type="monotone" 
            dataKey="bbMiddle" 
            stroke={CHART_COLORS[4]} 
            strokeDasharray="1 1"
            strokeWidth={1} 
            dot={false} 
            yAxisId="left"
            name="bbMiddle"
          />
           <Line 
            type="monotone" 
            dataKey="bbLower" 
            stroke={CHART_COLORS[3]} 
            strokeDasharray="2 2"
            strokeWidth={1} 
            dot={false} 
            yAxisId="left"
            name="bbLower"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
