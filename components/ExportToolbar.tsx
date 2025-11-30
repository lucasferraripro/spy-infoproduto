import React, { useState } from 'react';
import { MarketResearchResult } from '../types';
import { FileText, MonitorPlay, Download, Mail, FileSpreadsheet, File as FileIcon, Printer, Check, Copy } from 'lucide-react';

interface ExportToolbarProps {
  data: MarketResearchResult;
  niche: string;
}

const ExportToolbar: React.FC<ExportToolbarProps> = ({ data, niche }) => {
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  // --- Helpers to format data ---

  const generateReportText = () => {
    let text = `RELATÓRIO DE INTELIGÊNCIA DE MERCADO: ${niche.toUpperCase()}\n\n`;
    text += `VISÃO GERAL: ${data.niche_overview}\n\n`;
    text += `=== MELHOR OPORTUNIDADE ===\n`;
    text += `Produto Original: ${data.best_product.original_name}\n`;
    text += `Novo Nome Sugerido: ${data.best_product.enhanced_version.new_name}\n`;
    text += `Conceito: ${data.best_product.enhanced_version.concept}\n\n`;
    
    text += `=== CONCORRENTES MAPEADOS ===\n`;
    data.products.forEach((p, i) => {
      text += `\n${i + 1}. ${p.name} (${p.advertiser_name})\n`;
      text += `   Preço: ${p.price}\n`;
      text += `   Headline: ${p.copy.headline}\n`;
      text += `   Por que vende: ${p.strategic_reasoning}\n`;
    });
    return text;
  };

  const generateCSV = () => {
    const headers = ["Nome", "Anunciante", "Preço", "Tipo", "Dor", "Headline", "Tempo Veiculação", "Escala"];
    const rows = data.products.map(p => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.advertiser_name.replace(/"/g, '""')}"`,
      `"${p.price.replace(/"/g, '""')}"`,
      `"${p.type.replace(/"/g, '""')}"`,
      `"${p.pain_point.replace(/"/g, '""')}"`,
      `"${p.copy.headline.replace(/"/g, '""')}"`,
      `"${p.ads_data.active_time.replace(/"/g, '""')}"`,
      `"${p.ads_data.quantity_estimation.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `spy_infoprodutos_${niche.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Actions ---

  const handleDocs = () => {
    const text = generateReportText();
    navigator.clipboard.writeText(text);
    setCopiedStatus('docs');
    setTimeout(() => setCopiedStatus(null), 3000);
    window.open('https://docs.new', '_blank');
  };

  const handleSlides = () => {
    // For slides, we want a more bulleted summary
    let text = `NICHO: ${niche}\n\n`;
    text += `VENCEDOR: ${data.best_product.enhanced_version.new_name}\n`;
    text += `\nCONCORRENTES:\n`;
    data.products.forEach(p => text += `- ${p.name} (${p.price})\n`);
    
    navigator.clipboard.writeText(text);
    setCopiedStatus('slides');
    setTimeout(() => setCopiedStatus(null), 3000);
    window.open('https://slides.new', '_blank');
  };

  const handlePrintPDF = () => {
    // Expand details before printing? 
    // Ideally, we'd rely on CSS print media to ensure content is visible, 
    // but window.print() is the most reliable "Save as PDF" for web apps without backend.
    window.print();
    setDownloadOpen(false);
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Relatório de Mercado: ${niche}`);
    const body = encodeURIComponent(generateReportText());
    // Mailto has a limit, but it's the most direct client-side method
    if (body.length > 1800) {
        // If too long, just copy to clipboard and open gmail
        navigator.clipboard.writeText(generateReportText());
        setCopiedStatus('email');
        setTimeout(() => setCopiedStatus(null), 3000);
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=(Cole+o+relatório+aqui)`, '_blank');
    } else {
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
  };

  return (
    <div className="bg-slate-900 border-y border-slate-800 py-3 px-4 sticky top-0 z-50 shadow-xl backdrop-blur-md bg-opacity-90 no-print flex flex-wrap justify-center gap-3 md:gap-6 animate-fadeIn">
      
      {/* Google Docs */}
      <button 
        onClick={handleDocs}
        className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors group relative"
        title="Copia o relatório e abre um novo Google Doc"
      >
        <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20">
            <FileText size={18} className="text-blue-500" />
        </div>
        <span className="hidden md:inline">Google Docs</span>
        {copiedStatus === 'docs' && (
            <span className="absolute -bottom-8 left-0 text-[10px] bg-green-500 text-white px-2 py-1 rounded w-32">Copiado! Cole no Doc.</span>
        )}
      </button>

      {/* Google Slides */}
      <button 
        onClick={handleSlides}
        className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-yellow-400 transition-colors group relative"
        title="Copia resumo e abre novo Google Slide"
      >
        <div className="p-2 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20">
            <MonitorPlay size={18} className="text-yellow-500" />
        </div>
        <span className="hidden md:inline">Google Slides</span>
        {copiedStatus === 'slides' && (
            <span className="absolute -bottom-8 left-0 text-[10px] bg-green-500 text-white px-2 py-1 rounded w-32">Copiado! Cole no Slide.</span>
        )}
      </button>

      <div className="h-8 w-px bg-slate-700 mx-2 hidden md:block"></div>

      {/* Download Dropdown */}
      <div className="relative">
        <button 
            onClick={() => setDownloadOpen(!downloadOpen)}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
        >
            <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Download size={18} className="text-cyan-500" />
            </div>
            <span>Baixar</span>
        </button>

        {downloadOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                <button 
                    onClick={handlePrintPDF}
                    className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                >
                    <Printer size={14} /> PDF (Imprimir)
                </button>
                <button 
                    onClick={() => { generateCSV(); setDownloadOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                >
                    <FileSpreadsheet size={14} /> Arquivo CSV
                </button>
            </div>
        )}
      </div>

      <div className="h-8 w-px bg-slate-700 mx-2 hidden md:block"></div>

      {/* Email */}
      <button 
        onClick={handleEmail}
        className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-red-400 transition-colors relative"
      >
        <div className="p-2 bg-red-500/10 rounded-lg">
            <Mail size={18} className="text-red-500" />
        </div>
        <span className="hidden md:inline">Gmail</span>
        {copiedStatus === 'email' && (
            <span className="absolute -bottom-8 right-0 text-[10px] bg-green-500 text-white px-2 py-1 rounded w-32">Relatório copiado!</span>
        )}
      </button>

    </div>
  );
};

export default ExportToolbar;