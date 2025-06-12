
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { StockSentimentReport, Sentiment } from '../types';
import { GEMINI_MODEL_TEXT } from '../constants';

// Ensure process.env.API_KEY is available or provide a fallback for environments where it might not be set during generation.
// In a real build, this would be handled by environment variable injection.
const API_KEY = process.env.API_KEY || "YOUR_API_KEY_HERE"; 
const ai = new GoogleGenAI({ apiKey: API_KEY });

function isValidSentiment(sentiment: string): sentiment is Sentiment {
  return Object.values(Sentiment).includes(sentiment as Sentiment);
}

function isValidReportStructure(item: any): item is StockSentimentReport {
    return typeof item.ticker === 'string' &&
           isValidSentiment(item.overallSentiment) &&
           Array.isArray(item.headlines) &&
           item.headlines.every((h: any) => 
             typeof h.text === 'string' && isValidSentiment(h.sentiment)
           );
}


export const fetchSentimentData = async (tickers: string[], startDate: string): Promise<StockSentimentReport[]> => {
  if (API_KEY === "YOUR_API_KEY_HERE" && !(process.env.API_KEY && process.env.API_KEY !== "YOUR_API_KEY_HERE")) {
    console.warn("Usando chave de API de placeholder para o Gemini ou API_KEY não está efetivamente configurada. Por favor, garanta que process.env.API_KEY está configurado corretamente para chamadas reais à API. Recorrendo a dados simulados para sentimento.");
    return tickers.map(ticker => ({
        ticker,
        overallSentiment: Sentiment.Neutral,
        headlines: [
            { text: `Manchete simulada: Análise de sentimento para ${ticker} apareceria aqui (Chave de API não configurada).`, sentiment: Sentiment.Neutral },
            { text: `Simulado positivo: ${ticker} mostra sinais promissores.`, sentiment: Sentiment.Positive },
            { text: `Simulado negativo: ${ticker} enfrenta desafios.`, sentiment: Sentiment.Negative },
        ].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random()*2)+1)
    }));
  }

  const tickerListString = tickers.join(', ');
  const prompt = `
Para cada um dos seguintes tickers de ações: ${tickerListString}, por favor, atue como um sumarizador de notícias financeiras.
1. Gere de 1 a 3 manchetes de notícias realistas e com sonoridade recente para cada ticker. Se não houver notícias específicas, gere uma manchete neutra placeholder.
2. Para cada manchete, determine seu sentimento (Positivo, Neutro ou Negativo).
3. Forneça um sentimento geral (Positivo, Neutro ou Negativo) para cada ticker de ação com base nessas manchetes. Se as manchetes forem mistas ou neutras, o sentimento geral deve refletir isso.
A data de início para consideração das notícias é ${startDate}, e a data final é hoje.

Por favor, forneça a saída em formato de array JSON, onde cada objeto no array representa uma ação e tem a seguinte estrutura:
{
  "ticker": "TICKER_DA_ACAO",
  "overallSentiment": "Positivo" | "Neutro" | "Negativo",
  "headlines": [
    { "text": "Texto da Manchete 1...", "sentiment": "Positivo" | "Neutro" | "Negativo" }
  ]
}
Certifique-se de que o JSON é válido. Não inclua nenhum texto explicativo antes ou depois do array JSON.
Apenas envie o array JSON. Cada ticker deve ter uma entrada na resposta.
`;

  let jsonStr = ''; 
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.5, 
        }
    });

    jsonStr = response.text.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);

    if (Array.isArray(parsedData) && parsedData.every(isValidReportStructure)) {
      const resultReports: StockSentimentReport[] = [];
      // const receivedTickers = new Set(parsedData.map(p => p.ticker.toUpperCase())); // Not strictly needed with the loop below

      tickers.forEach(requestedTicker => {
        const report = parsedData.find(p => p.ticker.toUpperCase() === requestedTicker.toUpperCase());
        if (report) {
          resultReports.push(report);
        } else {
          // Add a placeholder if Gemini didn't return data for a specific ticker
          resultReports.push({
            ticker: requestedTicker,
            overallSentiment: Sentiment.Neutral,
            headlines: [{ text: `IA não conseguiu recuperar sentimento de notícias específico para ${requestedTicker}. Condições gerais de mercado podem se aplicar.`, sentiment: Sentiment.Neutral }]
          });
        }
      });
      return resultReports;

    } else {
        console.error("Estrutura JSON inválida recebida da API após o parsing. Dados:", parsedData);
        if (jsonStr) {
             console.error("String original (após remoção da cerca) que levou à estrutura inválida:", jsonStr);
        }
        throw new Error("Recebida estrutura de dados inválida da API de análise de sentimento.");
    }

  } catch (error) {
    console.error("Erro ao buscar ou parsear dados de sentimento da API Gemini.");
    if (jsonStr) { 
        console.error("String JSON problemática recebida da API (após remoção da cerca, antes da tentativa de parsing):", jsonStr);
    }
    console.error("Erro detalhado:", error);

    console.warn(`Recorrendo a dados de sentimento simulados para os tickers: ${tickers.join(', ')} devido a erro na API.`);
     return tickers.map(ticker => ({
        ticker,
        overallSentiment: Sentiment.Neutral,
        headlines: [
            { text: `Erro ao buscar/parsear sentimento de notícias por IA para ${ticker}. Exibindo dados de placeholder.`, sentiment: Sentiment.Neutral },
        ]
    }));
  }
};