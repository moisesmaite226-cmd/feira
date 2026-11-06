import React, { useState } from 'react';
import { useFeira } from '../context/FeiraContext';
import { 
  Printer, 
  Download, 
  CheckCircle2, 
  Building2,
  Sparkles,
  Moon
} from 'lucide-react';

export const PrestacaoContasView: React.FC = () => {
  const { feiras, metrics } = useFeira();

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csv = 'Data,Status,Arrecadacao Bruta,Despesas,Saldo Liquido,Visitantes Estimados,Auditoria\n';
    feiras.forEach(f => {
      const rec = Object.values(f.entries).reduce((sum, e) => sum + (e.isPaid ? e.value : 0), 0);
      const exp = f.expenses.reduce((sum, e) => sum + e.amount, 0);
      const net = rec - exp;
      csv += `"${f.displayDate}","${f.status}","${rec.toFixed(2)}","${exp.toFixed(2)}","${net.toFixed(2)}","${f.estimatedVisitors || 0}","${f.systemOk ? 'OK' : '-'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `prestacao_contas_feira_da_lua_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 print:p-0 print:space-y-4">
      
      {/* 1. Header Toolbar */}
      <div className="bg-[#0E1A38]/90 border border-amber-400/20 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:border-none print:p-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F5B731]"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Prestação de Contas</span>
              <span className="text-amber-300 font-artistic italic text-2xl font-normal">· Balanço Oficial</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-sky-200/70 mt-1">
            Relatório contábil consolidado da temporada para prestação de contas à associação e órgãos públicos.
          </p>
        </div>

        <div className="flex items-center gap-2.5 print:hidden">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#070D1E] hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Relatório</span>
          </button>
        </div>
      </div>

      {/* 2. Official Printable Statement */}
      <div className="bg-[#0E1A38]/90 border border-amber-400/25 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md print:bg-white print:border-none print:shadow-none print:p-0 print:text-black">
        
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 print:border-slate-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold print:border-black print:text-black shadow-[0_0_12px_rgba(245,183,49,0.25)]">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white print:text-black">
                  ASSOCIAÇÃO DOS FEIRANTES & ORGANIZAÇÃO FEIRA DA LUA
                </h3>
                <p className="text-xs text-sky-200/70 print:text-slate-600 font-artistic italic text-sm">
                  Exercício Contábil da Temporada 2026 · Praça Central sob a Noite Estrelada
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-400 print:text-slate-600 font-mono">
              <div>Data: {new Date().toLocaleDateString('pt-BR')}</div>
              <div className="text-amber-300 font-semibold print:text-black">Status: Regularizado</div>
            </div>
          </div>
        </div>

        {/* Highlights Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <div className="p-4 rounded-2xl bg-[#070D1E]/90 border border-slate-800 print:bg-slate-50 print:border-slate-300">
            <span className="text-[11px] font-bold text-amber-200/80 uppercase tracking-wider block font-artistic italic text-sm">
              Receita Total
            </span>
            <span className="text-xl sm:text-2xl font-mono font-bold text-amber-300 print:text-black mt-1 block">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.totalReceitaBruta)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#070D1E]/90 border border-slate-800 print:bg-slate-50 print:border-slate-300">
            <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block font-artistic italic text-sm">
              Custos Operacionais
            </span>
            <span className="text-xl sm:text-2xl font-mono font-bold text-rose-400 print:text-black mt-1 block">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.totalDespesasOperacionais)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#070D1E]/90 border border-slate-800 print:bg-slate-50 print:border-slate-300">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block font-artistic italic text-sm">
              Superávit Líquido
            </span>
            <span className="text-xl sm:text-2xl font-mono font-bold text-white print:text-black mt-1 block">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.saldoLiquidoGeral)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#070D1E]/90 border border-slate-800 print:bg-slate-50 print:border-slate-300">
            <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider block font-artistic italic text-sm">
              Taxa de Adimplência
            </span>
            <span className="text-xl sm:text-2xl font-mono font-bold text-sky-300 print:text-black mt-1 block">
              {metrics.taxaAdimplencia}%
            </span>
          </div>
        </div>

        {/* Accounting Table per Feira */}
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-sky-200/80 font-bold uppercase tracking-wider print:border-slate-400 print:text-slate-800">
                <th className="py-3 px-3">Edição / Data</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Arrecadação Bruta</th>
                <th className="py-3 px-3 text-right">Custos da Noite</th>
                <th className="py-3 px-3 text-right">Resultado Líquido</th>
                <th className="py-3 px-3 text-center">Público Est.</th>
                <th className="py-3 px-3 text-center">Auditoria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono print:divide-slate-300 print:text-black">
              {feiras.map(f => {
                const isCancelada = f.status === 'cancelada';
                const rec = Object.values(f.entries).reduce((sum, e) => sum + (e.isPaid ? e.value : 0), 0);
                const exp = f.expenses.reduce((sum, e) => sum + e.amount, 0);
                const net = rec - exp;

                return (
                  <tr key={f.id} className="hover:bg-slate-800/25 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white print:text-black">
                      {f.displayDate}
                    </td>

                    <td className="py-3 px-3">
                      {isCancelada ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 print:border-slate-400 print:text-black">
                          Cancelada (Chuva)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800 print:border-slate-400 print:text-black">
                          Realizada
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right font-medium text-amber-300 print:text-black">
                      {isCancelada ? 'R$ 0,00' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rec)}
                    </td>

                    <td className="py-3 px-3 text-right text-rose-400 print:text-black">
                      {isCancelada ? 'R$ 0,00' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(exp)}
                    </td>

                    <td className="py-3 px-3 text-right font-bold">
                      <span className={isCancelada ? 'text-slate-400' : net >= 0 ? 'text-white print:text-black' : 'text-rose-400 print:text-black'}>
                        {isCancelada ? 'R$ 0,00' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(net)}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center text-slate-300 print:text-black">
                      {isCancelada ? '-' : `${f.estimatedVisitors || 2800}`}
                    </td>

                    <td className="py-3 px-3 text-center">
                      {f.systemOk ? (
                        <span className="text-emerald-400 print:text-black font-sans font-medium flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Aprovado
                        </span>
                      ) : (
                        <span className="text-slate-500 font-sans">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Signatures Block */}
        <div className="mt-12 pt-8 border-t border-slate-800 print:border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-xs">
          <div className="space-y-1">
            <div className="border-b border-slate-600 print:border-black w-48 mx-auto pb-6"></div>
            <span className="font-semibold text-white print:text-black block">Presidente da Associação</span>
            <span className="text-slate-400 print:text-slate-600 text-[11px] font-artistic italic text-sm">Coordenação Feira da Lua</span>
          </div>

          <div className="space-y-1">
            <div className="border-b border-slate-600 print:border-black w-48 mx-auto pb-6"></div>
            <span className="font-semibold text-white print:text-black block">Tesouraria & Caixa</span>
            <span className="text-slate-400 print:text-slate-600 text-[11px] font-artistic italic text-sm">Prestação de Contas</span>
          </div>

          <div className="space-y-1">
            <div className="border-b border-slate-600 print:border-black w-48 mx-auto pb-6"></div>
            <span className="font-semibold text-white print:text-black block">Fiscal de Posturas</span>
            <span className="text-slate-400 print:text-slate-600 text-[11px] font-artistic italic text-sm">Vistoria e Alvará</span>
          </div>
        </div>

      </div>
    </div>
  );
};
