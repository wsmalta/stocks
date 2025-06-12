
export enum Sentiment {
  Positive = 'Positivo',
  Neutral = 'Neutro',
  Negative = 'Negativo',
}

export interface HeadlineSentiment {
  text: string;
  sentiment: Sentiment;
}

export interface StockSentimentReport {
  ticker: string;
  overallSentiment: Sentiment;
  headlines: HeadlineSentiment[];
}

export interface StockPricePoint {
  date: string; // YYYY-MM-DD
  price: number;
}

export interface StockHistoricalData {
  ticker: string;
  prices: StockPricePoint[]; // Renamed from 'historicalPrices' for clarity if used standalone
}

// For Recharts general charts
export interface ChartDataPoint {
  date: string; // Formatted for display
  [ticker: string]: number | string; // e.g., AAPL: 150.00, MSFT: 300.00
}

// --- New Types for Detailed Analysis ---

export interface MovingAverageData {
  period: number;
  value: number | null;
}

export interface BollingerBandsData {
  middleBand: number | null; // Typically 20-day SMA
  upperBand: number | null;
  lowerBand: number | null;
}

export interface MACDData {
  macdLine: number | null;
  signalLine: number | null;
  histogram: number | null;
}

export interface TechnicalIndicatorsData {
  smas: MovingAverageData[]; // e.g., [{ period: 20, value: 150.50 }, { period: 50, value: 145.20 }]
  rsi: { period: 14, value: number | null, interpretation: string };
  macd: { values: MACDData, interpretation: string };
  bollingerBands: { values: BollingerBandsData, interpretation: string }; // Interpretation for BBs overall
}

export interface FundamentalMetric {
  name: string;
  value: string | number;
  interpretation: string;
  threshold?: string; // Optional e.g., "Ideal: < 1"
}

export interface FundamentalMetricsData {
  peRatio: FundamentalMetric;
  pegRatio: FundamentalMetric;
  pbRatio: FundamentalMetric;
  debtToEquity: FundamentalMetric;
  currentRatio: FundamentalMetric;
  roe: FundamentalMetric; // Return on Equity
  eps: FundamentalMetric; // Earnings Per Share
  marketCap: FundamentalMetric;
  companyName?: FundamentalMetric; // Added for display
}

// Data structure for the new IndividualStockChart
export interface IndividualChartDataPoint {
  date: string; // YYYY-MM-DD or formatted display string
  price: number | null;
  sma20?: number | null;
  sma50?: number | null;
  bbUpper?: number | null;
  bbMiddle?: number | null; // Same as sma20 usually
  bbLower?: number | null;
}

export interface StockFullAnalysis {
  ticker: string;
  companyName: string; // Mocked company name
  historicalPricePoints: StockPricePoint[]; // Raw historical prices
  sentimentReport: StockSentimentReport;
  technicalIndicators: TechnicalIndicatorsData;
  fundamentalMetrics: FundamentalMetricsData;
  individualChartData: IndividualChartDataPoint[]; // Pre-calculated for the individual chart
}