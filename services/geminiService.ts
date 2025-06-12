
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AIStockReport, StockFullAnalysis, FundamentalMetricsData, TechnicalIndicatorsData } from '../types';
import { GEMINI_MODEL_TEXT } from '../constants';
import { ptBR } from '../translations';


const API_KEY = process.env.API_KEY || "YOUR_API_KEY_HERE"; 
const ai = new GoogleGenAI({ apiKey: API_KEY });

function isValidAIReportStructure(item: any): item is AIStockReport {
    return typeof item.ticker === 'string' &&
           typeof item.companyOverview === 'string' &&
           typeof item.financialHealthAnalysis === 'string' &&
           typeof item.investmentOutlook === 'string';
}

const generateFallbackReport = (ticker: string): AIStockReport => ({
  ticker,
  companyOverview: ptBR.noAIReportData,
  financialHealthAnalysis: ptBR.noAIReportData,
  investmentOutlook: ptBR.noAIReportData,
});

export const fetchAIAnalysisForStock = async (
  ticker: string, 
  fundamentalMetrics: FundamentalMetricsData, 
  technicalIndicators: TechnicalIndicatorsData,
  companyName: string
): Promise<AIStockReport> => {
  if (API_KEY === "YOUR_API_KEY_HERE" && !(process.env.API_KEY && process.env.API_KEY !== "YOUR_API_KEY_HERE")) {
    console.warn(`Using placeholder API Key for Gemini for ${ticker}. Falling back to mock AI report.`);
    return {
        ticker,
        companyOverview: `Visão geral simulada para ${companyName} (${ticker}): Empresa líder em seu setor com foco em inovação. (API Key não configurada).`,
        financialHealthAnalysis: `Análise de saúde financeira simulada para ${ticker}: Apresenta indicadores fundamentalistas mistos, com P/L de ${fundamentalMetrics.peRatio.value} e ROE de ${fundamentalMetrics.roe.value}%. (API Key não configurada).`,
        investmentOutlook: `Perspectiva de investimento simulada para ${ticker}: Potencial de crescimento a longo prazo, mas com riscos de mercado a serem considerados. (API Key não configurada).`,
    };
  }

  // Sanitize data slightly for the prompt - focusing on key values
  const fundamentalsSummary = `
    Nome da Empresa: ${companyName},
    P/L: ${fundamentalMetrics.peRatio.value},
    ROE: ${fundamentalMetrics.roe.value}%,
    Dívida/Patrimônio: ${fundamentalMetrics.debtToEquity.value},
    Dividend Yield: ${fundamentalMetrics.dividendYield.value}%`;
  
  const technicalsSummary = `
    IFR(14): ${technicalIndicators.rsi.value?.toFixed(2)} (${technicalIndicators.rsi.interpretation}),
    MACD Histograma: ${technicalIndicators.macd.values.histogram?.toFixed(2)} (${technicalIndicators.macd.interpretation}),
    MMS(20): ${technicalIndicators.smas.find(s=>s.period===20)?.value?.toFixed(2)},
    MMS(50): ${technicalIndicators.smas.find(s=>s.period===50)?.value?.toFixed(2)}`;

  const prompt = `
Para a ação com ticker ${ticker} (${companyName}), com base nos seguintes dados financeiros e técnicos (simulados):
Dados Fundamentais: ${fundamentalsSummary}
Dados Técnicos: ${technicalsSummary}

Por favor, gere uma análise concisa para um investidor individual em PORTUGUÊS DO BRASIL.
A análise deve incluir:
1.  "companyOverview": Uma breve visão geral da empresa e seu setor de atuação principal (1-2 frases).
2.  "financialHealthAnalysis": Uma análise da saúde financeira da empresa com base nos dados fornecidos (2-3 frases).
3.  "investmentOutlook": Uma perspectiva de investimento, destacando potenciais pontos fortes e fracos (2-3 frases).

Responda SOMENTE com um objeto JSON válido contendo as chaves "ticker", "companyOverview", "financialHealthAnalysis", e "investmentOutlook".
Não inclua nenhuma introdução, explicação ou formatação markdown (como \`\`\`json).
Exemplo de formato esperado:
{
  "ticker": "${ticker}",
  "companyOverview": "...",
  "financialHealthAnalysis": "...",
  "investmentOutlook": "..."
}
`;

  let jsonStr = '';
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.6, 
        }
    });

    jsonStr = response.text.trim();
    // No need to strip markdown fences if responseMimeType: "application/json" works as expected
    // However, as a fallback, keeping a simplified check:
    if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.substring(7, jsonStr.length - 3).trim();
    } else if (jsonStr.startsWith("```")) {
         jsonStr = jsonStr.substring(3, jsonStr.length - 3).trim();
    }
    
    const parsedData = JSON.parse(jsonStr);

    if (isValidAIReportStructure(parsedData)) {
      // Ensure the ticker matches, as a safety check, or override if Gemini might change it
      parsedData.ticker = ticker; 
      return parsedData;
    } else {
        console.error(`Invalid JSON structure received from API for ${ticker}. Data:`, parsedData);
        if (jsonStr) {
             console.error("Original string that led to invalid structure:", jsonStr);
        }
        throw new Error(`Received invalid data structure for ${ticker} from AI analysis API.`);
    }

  } catch (error) {
    console.error(`Error fetching or parsing AI analysis for ${ticker}.`);
    if (jsonStr) { 
        console.error("Problematic JSON string received (before parsing attempt):", jsonStr);
    }
    console.error("Detailed error:", error);
    console.warn(`Falling back to placeholder AI report for ${ticker} due to API error.`);
    return generateFallbackReport(ticker);
  }
};

export const fetchAIAnalysisForAllStocks = async (partialAnalyses: Omit<StockFullAnalysis, 'aiReport'>[]): Promise<AIStockReport[]> => {
    const reports: AIStockReport[] = [];
    for (const stockData of partialAnalyses) {
        const report = await fetchAIAnalysisForStock(
            stockData.ticker,
            stockData.fundamentalMetrics,
            stockData.technicalIndicators,
            stockData.companyName
        );
        reports.push(report);
    }
    return reports;
};
