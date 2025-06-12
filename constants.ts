
import { Sentiment } from './types';

export const MAX_TICKERS = 10;

export const SENTIMENT_ICON: { [key in Sentiment]: string } = {
  [Sentiment.Positive]: '📈', 
  [Sentiment.Neutral]: '📊',  
  [Sentiment.Negative]: '📉', 
};

export const SENTIMENT_TEXT_COLOR: { [key in Sentiment]: string } = {
  [Sentiment.Positive]: 'text-green-400',
  [Sentiment.Neutral]: 'text-gray-400',
  [Sentiment.Negative]: 'text-red-400',
};

export const SENTIMENT_BG_COLOR: { [key in Sentiment]: string } = {
  [Sentiment.Positive]: 'bg-green-700/20 border-green-500/50',
  [Sentiment.Neutral]: 'bg-gray-700/20 border-gray-500/50',
  [Sentiment.Negative]: 'bg-red-700/20 border-red-500/50',
};

// More distinct colors for charts
export const CHART_COLORS = [
  '#34d399', // Emerald 400
  '#60a5fa', // Blue 400
  '#f472b6', // Pink 400
  '#fbbf24', // Amber 400
  '#818cf8', // Indigo 400
  '#a78bfa', // Violet 400
  '#c084fc', // Purple 400
  '#22d3ee', // Cyan 400
  '#f87171', // Red 400
  '#4ade80', // Green 400
];

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';