import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2, BarChart2, MapPin, Globe, ExternalLink } from 'lucide-react';
import { analyzeNiche } from './services/geminiService';
import { MarketResearchResult } from './types';
import AnalysisCard from './components/AnalysisCard';
import EnhancedProductCard from './components/EnhancedProductCard';
import ExportToolbar from './components/ExportToolbar';

function App() {
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MarketResearchResult | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setSources([]);

    try {
      const { data, sources: resultSources } = await analyzeNiche(niche);
      setResult(data);
      setSources(resultSources);
      
      // Small delay to allow render before scrolling
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (err) {
      setError("Falha ao analisar o nicho. A API pode estar sobrecarregada ou não retornou o formato esperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Render sources based on Google Search grounding
  const renderSources = () => {
    if (!sources || sources.length === 0) return null;

    // Flatten chunks to get URLs
    const links: { title: string, uri: string }[] = [];
    
    sources.forEach(chunk => {
      if (chunk.web?.uri) {
        links.push({ title: chunk.web.title || "Fonte Web", uri: chunk.web.uri });
      }
      if (chunk.maps?.uri) { // Although rare for infoproducts, we handle maps grounding
         links.push({ title: chunk.maps.title || "Localização Maps", uri: chunk.maps.uri });
      }
    });
    
    // Remove duplicates
    const uniqueLinks = Array.from(new Map(links.map(item => [item.uri, item])).values());

    if (uniqueLinks.length === 0) return null;

    return (
      <div className="mt-8 pt-6 border-t border-slate-800 no-print">
        <h4 className="text-slate-500 text-xs font-bold uppercase mb-3 flex items-center gap-2">
          <Globe size={14} /> Fontes Pesquisadas
        </h4>
        <div className="flex flex-wrap gap-2">
          {uniqueLinks.map((link, i) => (
            <a 
              key={i} 
              href={link.uri} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded transition-colors"
            >
              {link.title} <ExternalLink size={10} />
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30">
      
      {/* Hero / Search Section */}
      <header className="relative overflow-hidden bg-slate-900 border-b border-slate-800 no-print">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?grayscale&blur=2')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>
        
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-1.5 mb-6 animate-fadeIn">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-300">Google Gemini 2.5 + Live Search Data</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-cyan-500">
            Spy Infoprodutos
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
            Encontro nichos, infoprodutos e copys e crio sua estratégia de vendas.
          </p>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-slate-900 rounded-lg border border-slate-700 p-2 shadow-2xl">
              <Search className="text-slate-500 ml-3 w-6 h-6" />
              <input 
                type="text" 
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Ex: Emagrecimento para mães, Marketing para Dentistas, Finanças Pessoais..." 
                className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-slate-600"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-md font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Pesquisar'}
              </button>
            </div>
          </form>

          {loading && (
             <div className="mt-8 text-sm text-cyan-400 animate-pulse flex flex-col items-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Varrendo o Google em busca de competidores e funis de vendas...</span>
             </div>
          )}
          
          {error && (
            <div className="mt-8 bg-red-500/10 border border-red-500/50 text-red-200 px-6 py-4 rounded-lg max-w-2xl mx-auto">
              {error}
            </div>
          )}
        </div>
      </header>

      {/* Results Section */}
      {result && (
        <>
          {/* Export Toolbar */}
          <ExportToolbar data={result} niche={niche} />

          <main ref={resultsRef} className="max-w-6xl mx-auto px-6 py-16">
            
            {/* Dashboard Header */}
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
               <div>
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                     <BarChart2 className="text-cyan-400" /> 
                     Relatório de Inteligência: {niche || 'Mercado Geral'}
                  </h2>
                  <p className="text-slate-400 max-w-3xl leading-relaxed">
                     {result.niche_overview}
                  </p>
               </div>
               <div className="text-right hidden md:block no-print">
                  <span className="block text-sm text-slate-500 uppercase font-bold">Produtos Analisados</span>
                  <span className="text-4xl font-mono font-bold text-white">{result.products.length}</span>
               </div>
            </div>

            {/* Winning Product Enhanced - TOP */}
            <EnhancedProductCard bestProduct={result.best_product} />

            {/* Product List */}
            <div className="mt-16 break-before-page">
              <h3 className="text-xl font-bold text-white mb-6 pl-4 border-l-4 border-cyan-500">
                 Detalhamento dos Concorrentes Mapeados
              </h3>
              <div className="space-y-4">
                 {result.products.map((product, index) => (
                    <AnalysisCard key={index} product={product} index={index} />
                 ))}
              </div>
            </div>

            {/* Sources Footer */}
            {renderSources()}

          </main>
        </>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-center text-slate-600 text-sm no-print">
        <p>Spy Infoprodutos &copy; {new Date().getFullYear()} • Powered by Google Gemini 2.5 Flash</p>
      </footer>

    </div>
  );
}

export default App;