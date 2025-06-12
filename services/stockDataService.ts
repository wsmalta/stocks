
import { 
  StockFullAnalysis,
  StockPricePoint,
  TechnicalIndicatorsData,
  FundamentalMetricsData,
  IndividualChartDataPoint,
  MovingAverageData,
  BollingerBandsData,
  AIStockReport, // Using this for the shape of AI data
} from '../types';
import { ptBR } from '../translations';

// Helper to calculate Simple Moving Average (remains the same)
const calculateSMA = (data: number[], period: number): (number | null)[] => {
  if (period <= 0 || data.length < period) {
    return Array(data.length).fill(null);
  }
  const sma: (number | null)[] = Array(period - 1).fill(null);
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0);
    sma.push(parseFloat((sum / period).toFixed(2)));
  }
  return sma;
};

// Helper to calculate Bollinger Bands (remains the same)
const calculateBollingerBands = (prices: number[], period: number, stdDevMultiplier: number): { middle: (number|null)[], upper: (number|null)[], lower: (number|null)[] } => {
  const smaValues = calculateSMA(prices, period);
  const upperBand: (number | null)[] = [];
  const lowerBand: (number | null)[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1 || smaValues[i] === null) {
      upperBand.push(null);
      lowerBand.push(null);
      continue;
    }
    const slice = prices.slice(Math.max(0, i - period + 1), i + 1);
    const mean = smaValues[i]!;
    const variance = slice.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    upperBand.push(parseFloat((mean + stdDevMultiplier * stdDev).toFixed(2)));
    lowerBand.push(parseFloat((mean - stdDevMultiplier * stdDev).toFixed(2)));
  }
  return { middle: smaValues, upper: upperBand, lower: lowerBand };
};


const generateMockTechnicalIndicators = (prices: number[]): TechnicalIndicatorsData => {
  const sma20Values = calculateSMA(prices, 20);
  const sma50Values = calculateSMA(prices, 50);
  
  const bb = calculateBollingerBands(prices, 20, 2);

  const lastSma20 = sma20Values[sma20Values.length - 1];
  const lastSma50 = sma50Values[sma50Values.length - 1];
  
  const smas: MovingAverageData[] = [
    { period: 20, value: lastSma20 },
    { period: 50, value: lastSma50 },
  ];

  const rsiValue = Math.floor(Math.random() * (85 - 15 + 1)) + 15;
  let rsiInterpretation = "Neutro";
  if (rsiValue > 70) rsiInterpretation = "Sobrecomprado (Potencial Sinal de Venda)";
  if (rsiValue < 30) rsiInterpretation = "Sobrevendido (Potencial Sinal de Compra)";

  const macdLine = parseFloat(((Math.random() - 0.5) * 5).toFixed(2));
  const signalLine = parseFloat((macdLine + (Math.random() - 0.5) * 1).toFixed(2));
  const histogram = parseFloat((macdLine - signalLine).toFixed(2));
  let macdInterpretation = "Neutro";
  if (macdLine > signalLine && histogram > 0) macdInterpretation = "Cruzamento Altista (Potencial Sinal de Compra)";
  if (macdLine < signalLine && histogram < 0) macdInterpretation = "Cruzamento Baixista (Potencial Sinal de Venda)";
  
  const lastBB = {
    middleBand: bb.middle[bb.middle.length -1],
    upperBand: bb.upper[bb.upper.length -1],
    lowerBand: bb.lower[bb.lower.length -1],
  };
  let bbInterpretation = "Preço dentro das bandas.";
  const lastPrice = prices[prices.length -1];
  if(lastBB.upperBand && lastPrice > lastBB.upperBand) bbInterpretation = "Preço rompeu banda superior (Potencial Sobrecompra/Reversão).";
  if(lastBB.lowerBand && lastPrice < lastBB.lowerBand) bbInterpretation = "Preço rompeu banda inferior (Potencial Sobrevenda/Reversão).";

  return {
    smas,
    rsi: { period: 14, value: rsiValue, interpretation: rsiInterpretation },
    macd: { values: { macdLine, signalLine, histogram }, interpretation: macdInterpretation },
    bollingerBands: { values: lastBB, interpretation: bbInterpretation }
  };
};

const generateMockFundamentalMetrics = (ticker: string, lastPrice: number): FundamentalMetricsData => {
  const marketCapValue = Math.random() * (ticker.match(/[0-9]$/) ? 500 : 2000) + (ticker.match(/[0-9]$/) ? 5 : 10); // Billions, adjusted for potential BR market cap
  const epsValue = parseFloat((Math.random() * 10 - 2).toFixed(2));
  const peRatioValue = epsValue > 0 ? parseFloat((lastPrice / epsValue).toFixed(2)) : null;
  const pegRatioValue = peRatioValue ? parseFloat((peRatioValue / (Math.random() * 2 + 0.5)).toFixed(2)) : null;
  const pbRatioValue = parseFloat((Math.random() * 5 + 0.5).toFixed(2));
  const debtToEquityValue = parseFloat((Math.random() * 2).toFixed(2));
  const currentRatioValue = parseFloat((Math.random() * 3 + 0.5).toFixed(2));
  const roeValue = parseFloat((Math.random() * 30 - 10).toFixed(2));
  const dividendYieldValue = parseFloat((Math.random() * (ticker.match(/[0-9]$/) ? 12 : 5)).toFixed(2)); // Higher potential DY for BR stocks

  const companyNames: { [key: string]: string } = {
    "AAPL": "Apple Inc.", "MSFT": "Microsoft Corp.", "GOOG": "Alphabet Inc.", "AMZN": "Amazon.com Inc.",
    "TSLA": "Tesla Inc.", "NVDA": "NVIDIA Corp.", "META": "Meta Platforms Inc.", "JPM": "JPMorgan Chase & Co.",
    "V": "Visa Inc.", "JNJ": "Johnson & Johnson",
    "PETR4": "Petrobras PN", "VALE3": "Vale ON", "ITUB4": "Itaú Unibanco PN", "BBDC4": "Bradesco PN",
    "MGLU3": "Magazine Luiza ON", "WEGE3": "WEG ON"
  };

  return {
    companyName: { name: "Nome da Empresa", value: companyNames[ticker.toUpperCase()] || `${ticker} Corp S.A.`, interpretation: "" },
    peRatio: { name: ptBR.peRatio, value: peRatioValue !== null ? peRatioValue : "N/A", interpretation: peRatioValue ? (peRatioValue > 25 ? "Alto (Potencialmente Supervalorizado)" : (peRatioValue < 15 ? "Baixo (Potencialmente Subvalorizado)" : "Valorizado de forma justa")) : "N/A devido a LPA negativo/zero" },
    pegRatio: { name: ptBR.pegRatio, value: pegRatioValue !== null ? pegRatioValue : "N/A", interpretation: pegRatioValue ? (pegRatioValue > 2 ? "Alto (Crescimento pode não justificar P/L)" : (pegRatioValue < 1 ? "Baixo (Potencialmente Subvalorizado para Crescimento)" : "Valorizado de forma justa para Crescimento")) : "N/A" },
    pbRatio: { name: ptBR.pbRatio, value: pbRatioValue, interpretation: pbRatioValue > 3 ? "Alto (Potencialmente Supervalorizado)" : (pbRatioValue < 1 ? "Baixo (Potencialmente Subvalorizado)" : "Valorizado de forma justa") },
    debtToEquity: { name: ptBR.debtToEquity, value: debtToEquityValue, interpretation: debtToEquityValue > 1 ? "Alta Alavancagem (Maior Risco)" : (debtToEquityValue < 0.5 ? "Baixa Alavancagem (Menor Risco)" : "Alavancagem Moderada") },
    currentRatio: { name: ptBR.currentRatio, value: currentRatioValue, interpretation: currentRatioValue > 2 ? "Forte Liquidez" : (currentRatioValue < 1 ? "Fraca Liquidez (Risco)" : "Liquidez Aceitável") },
    roe: { name: ptBR.roe, value: roeValue, interpretation: roeValue > 15 ? "Forte Rentabilidade" : (roeValue < 5 ? "Fraca Rentabilidade" : "Rentabilidade Moderada") },
    eps: { name: ptBR.eps, value: epsValue, interpretation: epsValue > 0 ? "Lucrativa" : "Não Lucrativa" },
    marketCap: { name: ptBR.marketCap, value: marketCapValue.toFixed(2), interpretation: "Indicador do Tamanho da Empresa" },
    dividendYield: { name: ptBR.dividendYield, value: dividendYieldValue, interpretation: dividendYieldValue > 5 ? "Alto DY" : (dividendYieldValue > 2 ? "DY Moderado" : "Baixo DY ou Não Paga") },
  };
};

// Generates the base analysis data, AI report will be fetched separately
export const generateMockStockAnalyses = (tickers: string[], startDateStr: string): Omit<StockFullAnalysis, 'aiReport'>[] => {
  const results: Omit<StockFullAnalysis, 'aiReport'>[] = [];
  const today = new Date();
  const startDate = new Date(startDateStr);

  if (startDate > today) {
    return []; 
  }
  
  tickers.forEach(tickerInput => {
    const ticker = tickerInput.toUpperCase();
    const historicalPricePoints: StockPricePoint[] = [];
    const pricesOnly: number[] = [];
    let currentDate = new Date(startDate);
    // Adjust starting price based on typical ranges (e.g., BR stocks often lower nominal value than US giants)
    let lastPrice = ticker.match(/[0-9]$/) ? (10 + Math.random() * 90) : (50 + Math.random() * 350); 


    while (currentDate <= today) {
      const currentPriceNum = parseFloat(lastPrice.toFixed(2));
      historicalPricePoints.push({
        date: currentDate.toISOString().split('T')[0],
        price: currentPriceNum,
      });
      pricesOnly.push(currentPriceNum);
      
      const changePercent = (Math.random() - 0.48) * 0.05; 
      lastPrice *= (1 + changePercent);
      if (lastPrice < 0.5) lastPrice = 0.5; // Prevent extremely low prices

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const technicalIndicators = generateMockTechnicalIndicators(pricesOnly);
    const fundamentalMetrics = generateMockFundamentalMetrics(ticker, pricesOnly[pricesOnly.length -1]);

    const sma20Values = calculateSMA(pricesOnly, 20);
    const sma50Values = calculateSMA(pricesOnly, 50);
    const bbValues = calculateBollingerBands(pricesOnly, 20, 2);

    const individualChartData: IndividualChartDataPoint[] = historicalPricePoints.map((pp, index) => ({
      date: new Date(pp.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', year: '2-digit' }),
      price: pp.price,
      sma20: sma20Values[index],
      sma50: sma50Values[index],
      bbMiddle: bbValues.middle[index],
      bbUpper: bbValues.upper[index],
      bbLower: bbValues.lower[index],
    }));
    
    results.push({ 
      ticker,
      market: ticker.match(/[0-9]$/) ? 'BR' : 'US',
      companyName: (fundamentalMetrics.companyName?.value as string) || `${ticker} Corp.`,
      historicalPricePoints,
      // aiReport will be added after Gemini call
      technicalIndicators,
      fundamentalMetrics,
      individualChartData,
    });
  });

  return results;
};

// This function is illustrative for the homepage and would need a real API in a production app
export const getMockTopTradedStocks = (): { usStocks: StockFullAnalysis[], brStocks: StockFullAnalysis[] } => {
  const mockUSFull = generateMockStockAnalyses(['AAPL', 'MSFT', 'GOOG'], new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0])
    .map(s => ({...s, aiReport: { ticker: s.ticker, companyOverview: "", financialHealthAnalysis: "", investmentOutlook: ""}})); // Add dummy aiReport
  
  const mockBRFull = generateMockStockAnalyses(['PETR4', 'VALE3', 'ITUB4'], new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0])
    .map(s => ({...s, aiReport: { ticker: s.ticker, companyOverview: "", financialHealthAnalysis: "", investmentOutlook: ""}})); // Add dummy aiReport

  return {
    usStocks: mockUSFull.slice(0,3),
    brStocks: mockBRFull.slice(0,3),
  };
};
