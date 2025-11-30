import React, { useState } from 'react';
import { Product } from '../types';
import { ChevronDown, ChevronUp, Target, Brain, FileText, Layers, TrendingUp, Clock, Megaphone, DollarSign, User } from 'lucide-react';

interface AnalysisCardProps {
  product: Product;
  index: number;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ product, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden mb-6 shadow-lg transition-all hover:shadow-cyan-900/20">
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="bg-cyan-500/10 text-cyan-400 text-xs font-bold px-2 py-1 rounded border border-cyan-500/20 uppercase tracking-wide">
                    #{index + 1} {product.type}
                    </span>
                    <span className="flex items-center gap-1 bg-green-500/10 text-green-400 text-xs font-bold px-2 py-1 rounded border border-green-500/20">
                        <DollarSign size={12} /> {product.price}
                    </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                    <User size={14} />
                    <span className="font-medium">{product.advertiser_name}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-900/40 p-2 rounded flex items-center gap-3 border border-slate-700/30">
                        <div className="bg-blue-500/20 p-1.5 rounded text-blue-400">
                            <Clock size={16} />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase text-slate-500 font-bold block">Tempo de Veiculação</span>
                            <span className="text-sm text-slate-200">{product.ads_data.active_time}</span>
                        </div>
                    </div>
                    <div className="bg-slate-900/40 p-2 rounded flex items-center gap-3 border border-slate-700/30">
                        <div className="bg-purple-500/20 p-1.5 rounded text-purple-400">
                            <Megaphone size={16} />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase text-slate-500 font-bold block">Escala de Anúncios</span>
                            <span className="text-sm text-slate-200">{product.ads_data.quantity_estimation}</span>
                        </div>
                    </div>
                </div>

                <p className="text-slate-400 text-sm italic border-l-2 border-slate-600 pl-3">"{product.pain_point}"</p>
            </div>
            
            <button className="text-slate-400 hover:text-white transition-colors mt-1">
            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-8 pt-2 border-t border-slate-700 bg-slate-800/50 space-y-8 animate-fadeIn">
          
          {/* Why it sells */}
          <div className="bg-green-900/10 border border-green-900/30 p-4 rounded-lg">
             <span className="text-green-400 font-bold text-sm block mb-1">Por que este produto vende:</span>
             <p className="text-slate-300 text-sm">{product.strategic_reasoning}</p>
          </div>

          {/* Audience */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="col-span-full flex items-center gap-2 mb-2 text-cyan-400 font-semibold">
                <Target size={18} /> Público-Alvo
             </div>
             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <h4 className="text-xs uppercase text-slate-500 mb-1 font-bold">Demografia</h4>
                <p className="text-sm text-slate-300">{product.audience.demographics}</p>
             </div>
             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <h4 className="text-xs uppercase text-slate-500 mb-1 font-bold">Psicografia</h4>
                <p className="text-sm text-slate-300">{product.audience.psychographics}</p>
             </div>
             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <h4 className="text-xs uppercase text-slate-500 mb-1 font-bold">Consciência</h4>
                <p className="text-sm text-slate-300">{product.audience.awareness_level}</p>
             </div>
          </section>

          {/* Copy Breakdown */}
          <section>
             <div className="flex items-center gap-2 mb-4 text-purple-400 font-semibold">
                <FileText size={18} /> Breakdown da Copy
             </div>
             <div className="bg-slate-900 p-5 rounded-lg border border-slate-700 space-y-4">
                <div>
                   <span className="text-xs uppercase text-slate-500 font-bold block mb-1">Headline</span>
                   <p className="text-lg font-serif text-white italic">"{product.copy.headline}"</p>
                </div>
                {product.copy.subheadline && (
                    <div>
                    <span className="text-xs uppercase text-slate-500 font-bold block mb-1">Subheadline</span>
                    <p className="text-sm text-slate-300">"{product.copy.subheadline}"</p>
                    </div>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                   <div>
                      <span className="text-xs uppercase text-slate-500 font-bold block mb-1">Mecanismo Único</span>
                      <p className="text-sm text-yellow-400">{product.copy.unique_mechanism}</p>
                   </div>
                   <div>
                      <span className="text-xs uppercase text-slate-500 font-bold block mb-1">CTA</span>
                      <p className="text-sm font-bold text-white bg-slate-800 inline-block px-3 py-1 rounded">{product.copy.cta}</p>
                   </div>
                </div>
                <div>
                   <span className="text-xs uppercase text-slate-500 font-bold block mb-1">Principais Promessas</span>
                   <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                      {product.copy.promises.slice(0, 3).map((p, i) => (
                         <li key={i}>{p}</li>
                      ))}
                   </ul>
                </div>
             </div>
          </section>

          {/* Strategy & Structure */}
          <div className="grid md:grid-cols-2 gap-6">
              <section>
                <div className="flex items-center gap-2 mb-4 text-orange-400 font-semibold">
                    <Brain size={18} /> Análise Estratégica
                </div>
                <div className="space-y-3">
                    <div className="bg-slate-900/30 p-3 rounded border border-slate-700/30">
                        <span className="text-xs text-orange-400/80 block mb-1">Gatilhos Mentais</span>
                        <div className="flex flex-wrap gap-2">
                           {product.strategy.triggers.map((t, i) => (
                               <span key={i} className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">{t}</span>
                           ))}
                        </div>
                    </div>
                    <div className="bg-slate-900/30 p-3 rounded border border-slate-700/30">
                        <span className="text-xs text-orange-400/80 block mb-1">Emoções Ativadas</span>
                        <p className="text-sm text-slate-300">{product.strategy.emotions.join(", ")}</p>
                    </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4 text-blue-400 font-semibold">
                    <Layers size={18} /> Estrutura da Página
                </div>
                <div className="bg-slate-900/30 p-4 rounded border border-slate-700/30 h-full">
                    <ul className="space-y-2">
                        {product.page_structure.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                <span className="text-slate-600 font-mono text-xs pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                                {step}
                            </li>
                        ))}
                    </ul>
                </div>
              </section>
          </div>

          {/* Insights */}
          <section className="bg-gradient-to-r from-emerald-900/20 to-slate-900/20 border-l-4 border-emerald-500 p-4 rounded-r-lg">
             <div className="flex items-center gap-2 mb-2 text-emerald-400 font-semibold">
                <TrendingUp size={18} /> Insights do Analista
             </div>
             <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                   <span className="font-bold text-slate-300 block mb-1">Oportunidades:</span>
                   <p className="text-slate-400">{product.market_insights.opportunities}</p>
                </div>
                <div>
                   <span className="font-bold text-slate-300 block mb-1">Como melhorar:</span>
                   <p className="text-slate-400">{product.market_insights.improvements}</p>
                </div>
             </div>
          </section>

        </div>
      )}
    </div>
  );
};

export default AnalysisCard;