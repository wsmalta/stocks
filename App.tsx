
import React, { useState, useCallback } from 'react';
import { TickerInput } from './components/TickerInput';
import { SentimentDisplay } from './components/SentimentDisplay';
import { PriceChart } from './components/PriceChart';
import { NormalizedChart } from './components/NormalizedChart';
import { ReportExporter } from './components/ReportExporter';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ErrorMessage } from './components/common/ErrorMessage';
import { fetchSentimentData } from './services/geminiService';
import { generateMockStockAnalyses } from './services/stockDataService'; // Updated service
import { StockFullAnalysis, ChartDataPoint, StockSentimentReport } from './types';
import { MAX_TICKERS } from './constants';

// New components for detailed analysis
import { FundamentalAnalysisDisplay } from './components/FundamentalAnalysisDisplay';
import { TechnicalIndicatorsDisplay } from './components/TechnicalIndicatorsDisplay';
import { IndividualStockChart } from './components/IndividualStockChart';

const App: React.FC = () => {
  // Combined state for all analysis data per stock
  const [stockAnalyses, setStockAnalyses] = useState<StockFullAnalysis[]>([]);
  // Tickers and start date are still needed for chart components and re-analysis
  const [analyzedTickers, setAnalyzedTickers] = useState<string[]>([]); 

  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date.toISOString().split('T')[0];
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisPerformed, setAnalysisPerformed] = useState<boolean>(false);

  // Process data for combined historical price chart
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
  
  // Process data for normalized performance chart
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
    setStockAnalyses([]); // Clear previous results

    const parsedTickers = inputTickers.split(',').map(t => t.trim().toUpperCase()).filter(t => t).slice(0, MAX_TICKERS);
    if (parsedTickers.length === 0) {
      setError("Por favor, insira pelo menos um ticker de ação.");
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
      // Fetch sentiment data from Gemini
      const sentimentReportsArray: StockSentimentReport[] = await fetchSentimentData(parsedTickers, inputStartDate);
      const sentimentMap = new Map(sentimentReportsArray.map(r => [r.ticker, r]));

      // Generate mock data for historical prices, technicals, fundamentals
      // This function now returns StockFullAnalysis[] but without real sentiment
      const mockAnalysesWithPlaceholders = generateMockStockAnalyses(parsedTickers, inputStartDate);

      // Combine Gemini sentiment with other mock data
      const combinedAnalyses: StockFullAnalysis[] = mockAnalysesWithPlaceholders.map(analysis => {
        const sentiment = sentimentMap.get(analysis.ticker);
        return sentiment ? { ...analysis, sentimentReport: sentiment } : analysis; // Use Gemini sentiment if available
      });
      
      setStockAnalyses(combinedAnalyses);
      setAnalysisPerformed(true);

    } catch (err) {
      console.error("Erro durante a análise:", err);
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido durante a análise.");
      setStockAnalyses([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const chartData = processChartData(stockAnalyses);
  const normalizedChartData = processNormalizedChartData(stockAnalyses);
  const sentimentReportsForDisplay = stockAnalyses.map(sa => sa.sentimentReport);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-gray-100 p-4 sm:p-8 font-sans">
      <header className="text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600">
          Analisador de Ações Pro
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Insights abrangentes sobre tendências de mercado, sentimentos de ações e saúde financeira.
        </p>
      </header>

      <main>
        <div className="no-print mb-8 p-6 bg-slate-800 rounded-xl shadow-2xl">
          <TickerInput onAnalyze={handleAnalyze} initialStartDate={startDate} isLoading={isLoading} />
        </div>

        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {analysisPerformed && !isLoading && !error && stockAnalyses.length > 0 && (
          <div id="printable-report" className="space-y-10">
            <SentimentDisplay reports={sentimentReportsForDisplay} />
            <PriceChart data={chartData} tickers={analyzedTickers} />
            <NormalizedChart data={normalizedChartData} tickers={analyzedTickers} />

            {/* Detailed Analysis Section */}
            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500 mt-8 mb-6">
                Análise Detalhada das Ações
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
         {!analysisPerformed && !isLoading && !error && (
          <div className="text-center py-10">
            <p className="text-xl text-slate-400">Insira os tickers das ações e uma data de início para começar sua análise.</p>
             <img src="https://picsum.photos/seed/stockapp/800/400?grayscale&blur=2" alt="Fundo financeiro" className="mt-6 rounded-lg shadow-lg mx-auto opacity-30" />
          </div>
        )}
      </main>
      
      <footer className="text-center mt-12 text-sm text-slate-500 no-print">
        <p>&copy; {new Date().getFullYear()} Analisador de Ações Pro. Todos os dados são apenas para fins ilustrativos e educacionais.</p>
        <p>Desenvolvido com IA, React e Serviços de Dados Simulados.</p>
      </footer>
    </div>
  );
};

export default App;