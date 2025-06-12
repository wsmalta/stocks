
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area 
} from 'recharts';
import { IndividualChartDataPoint } from '../types';
import { CHART_COLORS } from '../constants'; // For base price line color

interface IndividualStockChartProps {
  ticker: string;
  data: IndividualChartDataPoint[];
}

export const IndividualStockChart: React.FC<IndividualStockChartProps> = ({ ticker, data }) => {
  if (!data || data.length === 0) {
    return <p className="text-slate-400 text-center py-4">Não há dados de gráfico disponíveis para {ticker}.</p>;
  }

  return (
    <div className="h-[450px] mt-4 bg-slate-700/30 p-4 rounded-lg">
       <h5 className="text-lg font-semibold text-center text-slate-200 mb-4">{ticker} Preço com Sobreposições Técnicas</h5>
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
            tickFormatter={(value) => `R$${Number(value).toFixed(2)}`} // Currency updated to R$
            yAxisId="left"
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid #475569', borderRadius: '0.5rem', color: '#e2e8f0' }}
            itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
            cursor={{ stroke: '#60a5fa', strokeWidth: 1, strokeDasharray: '3 3' }}
            formatter={(value: number, name: string) => {
                 let displayName = name;
                 if (name === "price") displayName = "Preço";
                 if (name === "sma20") displayName = "MMS 20";
                 if (name === "sma50") displayName = "MMS 50";
                 if (name === "bbUpper") displayName = "BB Superior";
                 if (name === "bbMiddle") displayName = "BB Média";
                 if (name === "bbLower") displayName = "BB Inferior";
                 return value !== null && value !== undefined ? [`R$${Number(value).toFixed(2)}`, displayName] : [null, null]; // Currency updated to R$
            }}
          />
          <Legend wrapperStyle={{ color: '#e2e8f0', paddingTop: '10px', fontSize: '12px' }} 
            formatter={(value) => {
                if (value === "Price") return "Preço";
                if (value === "SMA 20") return "MMS 20";
                if (value === "SMA 50") return "MMS 50";
                if (value === "BB Upper") return "BB Superior";
                if (value === "BB Middle") return "BB Média";
                if (value === "BB Lower") return "BB Inferior";
                return value;
            }}
          />

          {/* Bollinger Bands Area */}
          <Area 
            type="monotone" 
            dataKey="bbUpper" 
            stackId="bollinger" 
            stroke={CHART_COLORS[3]} 
            fill={CHART_COLORS[3]} 
            fillOpacity={0.05} 
            dot={false} 
            yAxisId="left"
            name="BB Superior"
          />
           <Area 
            type="monotone" 
            dataKey="bbLower" 
            stackId="bollinger" 
            stroke={CHART_COLORS[3]} 
            fill={CHART_COLORS[3]} 
            fillOpacity={0.05} 
            dot={false} 
            yAxisId="left"
            name="BB Inferior"
          />
          
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={CHART_COLORS[0]} 
            strokeWidth={2} 
            dot={false} 
            activeDot={{ r: 5 }} 
            yAxisId="left"
            name="Preço"
          />
          <Line 
            type="monotone" 
            dataKey="sma20" 
            stroke={CHART_COLORS[1]} 
            strokeWidth={1.5} 
            dot={false} 
            yAxisId="left"
            name="MMS 20"
          />
          <Line 
            type="monotone" 
            dataKey="sma50" 
            stroke={CHART_COLORS[2]} 
            strokeWidth={1.5} 
            dot={false} 
            yAxisId="left"
            name="MMS 50"
          />
           <Line 
            type="monotone" 
            dataKey="bbUpper" 
            stroke={CHART_COLORS[3]} 
            strokeDasharray="2 2"
            strokeWidth={1} 
            dot={false} 
            yAxisId="left"
            name="BB Superior"
          />
           <Line 
            type="monotone" 
            dataKey="bbMiddle" 
            stroke={CHART_COLORS[4]} 
            strokeDasharray="1 1"
            strokeWidth={1} 
            dot={false} 
            yAxisId="left"
            name="BB Média"
          />
           <Line 
            type="monotone" 
            dataKey="bbLower" 
            stroke={CHART_COLORS[3]} 
            strokeDasharray="2 2"
            strokeWidth={1} 
            dot={false} 
            yAxisId="left"
            name="BB Inferior"
          />


        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};