
// Removed Sentiment enum as it's replaced by AI textual analysis

export interface HeadlineSentiment { // Kept if any part of mock data still uses it, but primary analysis changes
  text: string;
  sentiment: string; // Generic sentiment string, e.g. 'Positivo', 'Neutro', 'Negativo'
}

// This structure is for the AI's direct response, per stock
export interface AIStockReport {
  ticker: string;
  companyOverview: string;
  financialHealthAnalysis: string;
  investmentOutlook: string;
}

export interface StockPricePoint {
  date: string; // YYYY-MM-DD
  price: number;
}

export interface StockHistoricalData { // For potential future direct use, less used now with StockFullAnalysis
  ticker: string;
  prices: StockPricePoint[];
}

export interface ChartDataPoint {
  date: string; // Formatted for display
  [ticker: string]: number | string;
}

export interface MovingAverageData {
  period: number;
  value: number | null;
}

export interface BollingerBandsData {
  middleBand: number | null;
  upperBand: number | null;
  lowerBand: number | null;
}

export interface MACDData {
  macdLine: number | null;
  signalLine: number | null;
  histogram: number | null;
}

export interface TechnicalIndicatorsData {
  smas: MovingAverageData[];
  rsi: { period: 14, value: number | null, interpretation: string };
  macd: { values: MACDData, interpretation: string };
  bollingerBands: { values: BollingerBandsData, interpretation: string };
}

export interface FundamentalMetric {
  name: string; // Localized name in display component
  value: string | number;
  interpretation: string; // AI can provide richer interpretations
  threshold?: string;
}

export interface FundamentalMetricsData {
  peRatio: FundamentalMetric;
  pegRatio: FundamentalMetric;
  pbRatio: FundamentalMetric;
  debtToEquity: FundamentalMetric;
  currentRatio: FundamentalMetric;
  roe: FundamentalMetric;
  eps: FundamentalMetric;
  marketCap: FundamentalMetric;
  dividendYield: FundamentalMetric; // Added
  companyName?: FundamentalMetric; 
}

export interface IndividualChartDataPoint {
  date: string;
  price: number | null;
  sma20?: number | null;
  sma50?: number | null;
  bbUpper?: number | null;
  bbMiddle?: number | null;
  bbLower?: number | null;
}

// Combined structure for each analyzed stock
export interface StockFullAnalysis {
  ticker: string;
  market?: 'US' | 'BR'; // Optional: to help with ticker specific logic if needed
  companyName: string;
  historicalPricePoints: StockPricePoint[];
  aiReport: AIStockReport; // Replaces sentimentReport
  technicalIndicators: TechnicalIndicatorsData;
  fundamentalMetrics: FundamentalMetricsData;
  individualChartData: IndividualChartDataPoint[];
}

// For the mocked homepage table
export interface TopTradedStock {
  ticker: string;
  companyName: string;
  dailyChange: string; // e.g., "+1.25%" or "-0.50%"
  market: 'US' | 'BR';
}
