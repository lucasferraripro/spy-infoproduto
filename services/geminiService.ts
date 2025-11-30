import { GoogleGenAI } from "@google/genai";
import { MarketResearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeNiche = async (niche: string): Promise<{ data: MarketResearchResult, sources: any[] }> => {
  const prompt = niche.trim() === ""
    ? "Realize uma pesquisa ampla de mercado para identificar de 3 a 5 das melhores oportunidades de infoprodutos VALIDADOS e LUCRATIVOS no momento atual (Brasil e Mundo). Pesquise por tendências de alta demanda."
    : `Realize uma pesquisa profunda de mercado para o nicho: "${niche}". Identifique de 3 a 5 infoprodutos mais validados, com alta demanda e concorrência forte.`;

  const systemInstruction = `
    Você é um Pesquisador de Mercado Sênior e Estrategista Digital especializado em infoprodutos.
    Sua missão é mapear produtos reais que estão vendendo agora e identificar sinais de validação financeira e de tráfego.
    
    INSTRUÇÕES DE PESQUISA:
    1. Use a ferramenta Google Search para encontrar infoprodutos reais (ebooks, cursos, mentorias, apps).
    2. Identifique o PREÇO atual de venda.
    3. Identifique o NOME DO ANUNCIANTE/ESPECIALISTA.
    4. SINAIS DE VALIDAÇÃO (CRUCIAL):
       - Tempo de veiculação: Tente inferir há quanto tempo o produto/anúncio roda. (Ex: "Anúncios ativos desde 2022" ou "Produto perene").
       - Quantidade de anúncios: Tente inferir a escala (Ex: "Muitas variações de criativos", "Escala alta").
    5. Analise a copy, o público e a estrutura de vendas.
    6. Traga apenas produtos validados (com vendas provadas).
    
    FORMATO DE SAÍDA:
    Primeiro, realize a pesquisa e a análise (pense passo a passo).
    EM SEGUIDA, gere um bloco de código JSON contendo EXATAMENTE a estrutura abaixo.
    
    \`\`\`json
    {
      "niche_overview": "Breve visão geral do mercado",
      "products": [
        {
          "name": "Nome do produto",
          "advertiser_name": "Nome do especialista ou empresa",
          "type": "Tipo (ebook, curso, etc)",
          "price": "Preço (Ex: R$ 97,00)",
          "ads_data": {
             "active_time": "Ex: Rodando anúncios há +6 meses",
             "quantity_estimation": "Ex: +15 variações ativas / Alta escala"
          },
          "pain_point": "Dor principal resolvida",
          "strategic_reasoning": "Por que vende",
          "audience": {
            "demographics": "Demografia",
            "psychographics": "Psicografia",
            "awareness_level": "Nível de consciência"
          },
          "copy": {
            "headline": "Manchete",
            "subheadline": "Submanchete",
            "bullets": ["bullet 1", "bullet 2"],
            "cta": "Chamada para ação",
            "promises": ["promessa 1"],
            "unique_mechanism": "Mecanismo único"
          },
          "page_structure": ["Seção 1", "Seção 2"],
          "strategy": {
            "triggers": ["Gatilho 1"],
            "biases": ["Viés 1"],
            "emotions": ["Emoção 1"],
            "key_arguments": ["Argumento 1"]
          },
          "market_insights": {
            "opportunities": "Oportunidades",
            "improvements": "Melhorias"
          }
        }
      ],
      "best_product": {
        "original_name": "Nome do melhor produto",
        "reason_selected": "Razão da escolha",
        "enhanced_version": {
          "new_name": "Novo nome sugerido",
          "concept": "Novo conceito",
          "new_copy_headline": "Nova headline aprimorada",
          "differentials": ["Diferencial 1", "Diferencial 2"],
          "logic": "Lógica por trás da melhoria"
        }
      }
    }
    \`\`\`
    
    IMPORTANTE: Limite a lista 'products' a no máximo 5 itens para evitar cortes na resposta.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
      },
    });

    let resultText = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    if (!resultText && response.candidates && response.candidates.length > 0) {
      resultText = response.candidates[0].content?.parts?.map(p => p.text).join('') || "";
    }

    if (!resultText) {
      console.error("Full Response Object:", JSON.stringify(response, null, 2));
      throw new Error("No data returned from AI");
    }

    const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = resultText.match(jsonBlockRegex);
    
    if (match && match[1]) {
        resultText = match[1];
    } else {
        const firstOpen = resultText.indexOf('{');
        const lastClose = resultText.lastIndexOf('}');
        
        if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
          resultText = resultText.substring(firstOpen, lastClose + 1);
        }
    }

    const data = JSON.parse(resultText) as MarketResearchResult;
    return { data, sources };

  } catch (error) {
    console.error("Error analyzing niche:", error);
    throw error;
  }
};