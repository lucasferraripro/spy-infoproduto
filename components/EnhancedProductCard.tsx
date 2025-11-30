import React from 'react';
import { BestProduct } from '../types';
import { Sparkles, Trophy, Zap, ArrowRight, Lightbulb } from 'lucide-react';

interface EnhancedProductCardProps {
  bestProduct: BestProduct;
}

const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({ bestProduct }) => {
  return (
    <div className="mt-12 mb-8 animate-slideUp">
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 rounded-2xl p-1 shadow-2xl shadow-indigo-500/20 border border-indigo-500/30">
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-6 md:p-10">
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Left: The Winner */}
            <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-700 pb-6 md:pb-0 md:pr-8">
              <div className="flex items-center gap-2 text-yellow-400 mb-4">
                <Trophy className="w-6 h-6" />
                <h3 className="font-bold text-lg uppercase tracking-wider">O Vencedor</h3>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{bestProduct.original_name}</h2>
              <p className="text-slate-400 text-sm italic mb-6">"{bestProduct.reason_selected}"</p>
              
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                   <Lightbulb className="w-5 h-5 text-indigo-400 mt-1 shrink-0" />
                   <div>
                     <span className="text-xs font-bold text-indigo-300 uppercase block mb-1">Lógica da Escolha</span>
                     <p className="text-sm text-slate-300 leading-relaxed">{bestProduct.enhanced_version.logic}</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Right: The Evolution */}
            <div className="w-full md:w-2/3 md:pl-4">
              <div className="flex items-center gap-2 text-pink-400 mb-6">
                <Sparkles className="w-6 h-6 animate-pulse" />
                <h3 className="font-bold text-lg uppercase tracking-wider">Versão Aprimorada (IA)</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Novo Nome</label>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400 mt-1">
                    {bestProduct.enhanced_version.new_name}
                  </h1>
                </div>

                <div className="bg-slate-800/40 p-5 rounded-lg border border-slate-700/50">
                   <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Novo Conceito & Big Idea</label>
                   <p className="text-slate-200 text-lg leading-relaxed">{bestProduct.enhanced_version.concept}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                   <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Nova Headline Principal</label>
                      <p className="text-white font-serif italic border-l-4 border-pink-500 pl-4 py-2 bg-slate-800/30 rounded-r">
                        "{bestProduct.enhanced_version.new_copy_headline}"
                      </p>
                   </div>
                   
                   <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Diferenciais Inéditos</label>
                      <ul className="space-y-2">
                        {bestProduct.enhanced_version.differentials.map((diff, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-indigo-200">
                             <Zap className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                             {diff}
                          </li>
                        ))}
                      </ul>
                   </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default EnhancedProductCard;