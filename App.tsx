
import React, { useState, useCallback, useEffect } from 'react';
import { TickerInput } from './components/TickerInput';
// import { SentimentDisplay } from './components/SentimentDisplay'; // Replaced
import { InvestmentInsightsDisplay } from './components/InvestmentInsightsDisplay.tsx'; // Corrected path with .tsx
import { PriceChart } from './components/PriceChart';
import { NormalizedChart } from './components/NormalizedChart';
import { ReportExporter } from './components/ReportExporter';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ErrorMessage } from './components/common/ErrorMessage';
// import { fetchSentimentData } from './services/geminiService'; // Replaced
import { fetchAIAnalysisForAllStocks } from './services/geminiService'; // New service function
import { generateMockStockAnalyses, getMockTopTradedStocks } from './services/stockDataService';
import { StockFullAnalysis, ChartDataPoint, AIStockReport } from './types';
import { MAX_TICKERS } from './constants';
import { ptBR } from './translations';

import { FundamentalAnalysisDisplay } from './components/FundamentalAnalysisDisplay';
import { TechnicalIndicatorsDisplay } from './components/TechnicalIndicatorsDisplay';
import { IndividualStockChart } from './components/IndividualStockChart';
import { MostTradedTable } from './components/MostTradedTable'; // New component for homepage


const App: React.FC = () => {
  const [stockAnalyses, setStockAnalyses] = useState<StockFullAnalysis[]>([]);
  const [analyzedTickers, setAnalyzedTickers] = useState<string[]>([]); 

  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date.toISOString().split('T')[0];
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisPerformed, setAnalysisPerformed] = useState<boolean>(false);

  // For homepage display (mocked)
  const [topUSStocks, setTopUSStocks] = useState<StockFullAnalysis[]>([]);
  const [topBRStocks, setTopBRStocks] = useState<StockFullAnalysis[]>([]);

  useEffect(() => {
    // Load mock "most traded" data on initial mount
    const { usStocks, brStocks } = getMockTopTradedStocks();
    setTopUSStocks(usStocks);
    setTopBRStocks(brStocks);
  }, []);


  const processChartData = useCallback((analyses: StockFullAnalysis[]): ChartDataPoint[] => {
    if (analyses.length === 0) return [];
    const allDates = new Set<string>();
    analyses.forEach(stock => stock.historicalPricePoints.forEach(p => allDates.add(p.date)));
    const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return sortedDates.map(date => {
      const dataPoint: ChartDataPoint = { date: new Date(date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', year: '2-digit' }) };
      analyses.forEach(stock => {
        const pricePoint = stock.historicalPricePoints.find(p => p.date === date);
        dataPoint[stock.ticker] = pricePoint ? pricePoint.price : NaN;
      });
      return dataPoint;
    });
  }, []);
  
  const processNormalizedChartData = useCallback((analyses: StockFullAnalysis[]): ChartDataPoint[] => {
    if (analyses.length === 0) return [];
    const allDates = new Set<string>();
    analyses.forEach(stock => stock.historicalPricePoints.forEach(p => allDates.add(p.date)));
    const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
    return sortedDates.map(date => {
      const dataPoint: ChartDataPoint = { date: new Date(date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', year: '2-digit' }) };
      analyses.forEach(stock => {
        const firstPricePoint = stock.historicalPricePoints[0];
        if (!firstPricePoint || firstPricePoint.price === 0) {
          dataPoint[stock.ticker] = NaN;
          return;
        }
        const currentPricePoint = stock.historicalPricePoints.find(p => p.date === date);
        dataPoint[stock.ticker] = currentPricePoint ? (currentPricePoint.price / firstPricePoint.price) * 100 : NaN;
      });
      return dataPoint;
    });
  }, []);

  const handleAnalyze = async (inputTickers: string, inputStartDate: string) => {
    setError(null);
    setIsLoading(true);
    setAnalysisPerformed(false);
    setStockAnalyses([]); 

    const parsedTickers = inputTickers.split(',').map(t => t.trim().toUpperCase()).filter(t => t).slice(0, MAX_TICKERS);
    if (parsedTickers.length === 0) {
      setError("Por favor, insira pelo menos um código de ação.");
      setIsLoading(false);
      return;
    }
    if (!inputStartDate) {
      setError("Por favor, selecione uma data de início.");
      setIsLoading(false);
      return;
    }

    setAnalyzedTickers(parsedTickers);
    setStartDate(inputStartDate);

    try {
      // Generate mock data for historical prices, technicals, fundamentals
      // This returns Omit<StockFullAnalysis, 'aiReport'>[]
      const baseAnalyses = generateMockStockAnalyses(parsedTickers, inputStartDate);

      // Fetch AI analysis (overview, health, outlook) for each stock
      const aiReportsArray: AIStockReport[] = await fetchAIAnalysisForAllStocks(baseAnalyses);
      const aiReportMap = new Map(aiReportsArray.map(r => [r.ticker, r]));
      
      const combinedAnalyses: StockFullAnalysis[] = baseAnalyses.map(baseAnalysis => {
        const aiReport = aiReportMap.get(baseAnalysis.ticker);
        if (!aiReport) { // Should not happen if fetchAIAnalysisForAllStocks is robust
            console.warn("Missing AI report for ticker: ", baseAnalysis.ticker);
             return { ...baseAnalysis, aiReport: { ticker: baseAnalysis.ticker, companyOverview: "N/A", financialHealthAnalysis: "N/A", investmentOutlook: "N/A" } };
        }
        return { ...baseAnalysis, aiReport };
      });
      
      setStockAnalyses(combinedAnalyses);
      setAnalysisPerformed(true);

    } catch (err) {
      console.error("Error during analysis:", err);
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido durante a análise.");
      setStockAnalyses([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const chartData = processChartData(stockAnalyses);
  const normalizedChartData = processNormalizedChartData(stockAnalyses);
  const aiReportsForDisplay = stockAnalyses.map(sa => sa.aiReport);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-gray-100 p-4 sm:p-8 font-sans">
      <header className="text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600">
          {ptBR.appName}
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          {ptBR.appSubtitle}
        </p>
      </header>

      <main>
        {/* Homepage Section - visible before analysis */}
        {!analysisPerformed && !isLoading && (
            <MostTradedTable usStocks={topUSStocks} brStocks={topBRStocks} />
        )}

        <div className="no-print mb-8 p-6 bg-slate-800 rounded-xl shadow-2xl">
          <TickerInput onAnalyze={handleAnalyze} initialStartDate={startDate} isLoading={isLoading} />
        </div>

        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        
        {/* Hidden span to provide tickers for PDF title */}
        {analysisPerformed && <span id="tickersForReportTitle" className="hidden">{analyzedTickers.join(', ')}</span>}


        {analysisPerformed && !isLoading && !error && stockAnalyses.length > 0 && (
          <div id="printable-report" className="space-y-10">
            <InvestmentInsightsDisplay reports={aiReportsForDisplay} />
            <PriceChart data={chartData} tickers={analyzedTickers} />
            <NormalizedChart data={normalizedChartData} tickers={analyzedTickers} />

            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500 mt-8 mb-6">
                {ptBR.detailedStockAnalysis}
              </h2>
              {stockAnalyses.map((stock) => (
                <div key={stock.ticker} className="p-6 bg-slate-800 rounded-xl shadow-2xl space-y-6">
                  <h3 className="text-2xl sm:text-3xl font-semibold text-sky-300 border-b border-slate-700 pb-3 mb-4">
                    {stock.ticker} - <span className="text-xl text-slate-300">{stock.companyName}</span>
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                       <FundamentalAnalysisDisplay metrics={stock.fundamentalMetrics} />
                    </div>
                    <div>
                      <TechnicalIndicatorsDisplay indicators={stock.technicalIndicators} />
                    </div>
                  </div>
                  <IndividualStockChart 
                    ticker={stock.ticker} 
                    data={stock.individualChartData} 
                  />
                </div>
              ))}
            </section>
            
            <ReportExporter />
          </div>
        )}
         {/* Initial state message when no analysis has been performed yet, AND homepage most traded table is already shown above */}
         {!analysisPerformed && !isLoading && !error && (
          <div className="text-center py-10">
            <p className="text-xl text-slate-400">{ptBR.startAnalysisPrompt}</p>
             <img src="https://picsum.photos/seed/stockapp-ptbr/800/400?grayscale&blur=1" alt="Fundo financeiro" className="mt-6 rounded-lg shadow-lg mx-auto opacity-30" />
          </div>
        )}
      </main>
      
      <footer className="text-center mt-12 text-sm text-slate-500 no-print">
        <p>&copy; {new Date().getFullYear()} {ptBR.appName}. {ptBR.footerDisclaimer}</p>
        <p>{ptBR.footerPoweredBy}</p>
      </footer>
    </div>
  );
};

export default App;
