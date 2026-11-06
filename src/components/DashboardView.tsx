import React from 'react';
import { useFeira } from '../context/FeiraContext';
import starryNightArt from '../assets/images/starry_night_market_1793716707624.jpg';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Users, 
  CloudSun, 
  AlertCircle, 
  MapPin, 
  Store, 
  MessageSquare, 
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
  Moon
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { metrics, feiras, pendingDebts, setActiveTab } = useFeira();

  const latestFeira = feiras[0];
  const totalPendente = pendingDebts.reduce((sum, d) => sum + d.pendingValue, 0);

  const recentFeiras = feiras
    .filter(f => f.status === 'realizada')
    .slice(0, 6)
    .reverse();

  const maxRevenue = Math.max(...recentFeiras.map(f => {
    return Object.values(f.entries).reduce((sum, e) => sum + (e.isPaid ? e.value : 0), 0);
  }), 1600);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Hero Impressionist Card with Van Gogh Starry Night Artwork */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-400/30 shadow-2xl bg-[#0E1835]/95">
        {/* Background Painting with Artistic Gradient Vignette */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 pointer-events-none"
          style={{ backgroundImage: `url(${starryNightArt})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1226]/95 via-[#0E1A38]/85 to-[#0A1428]/95 pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-artistic italic text-sm tracking-wide">A Noite Estrelada de Van Gogh</span>
              <span className="text-amber-400/50">·</span>
              <span>Painel Executivo</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Feira da Lua</span>
              <span className="text-amber-300 font-artistic italic font-normal text-3xl sm:text-4xl">
                Sob as Estrelas
              </span>
            </h2>
            
            <p className="text-sm text-sky-100/80 leading-relaxed font-light">
              Gestão de <span className="text-amber-300 font-semibold">{metrics.barracasAtivasTotal} barracas credenciadas</span>, praça boêmia, arrecadações Pix/Espécie e controle financeiro sob o céu estrelado.
            </p>
          </div>

          {/* Starry Night Weather Widget */}
          <div className="bg-[#070E22]/90 border border-amber-400/25 rounded-2xl p-4 flex items-center gap-4 w-full sm:w-auto shadow-xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/30 to-sky-600/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 shadow-[0_0_15px_rgba(245,183,49,0.3)]">
              <Moon className="w-6 h-6 fill-amber-300/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-200/90 font-artistic italic text-sm">Céu da Noite</span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              </div>
              <div className="text-lg font-bold text-white font-mono">
                {latestFeira?.weather?.temp || '22°C'} · Céu Estrelado
              </div>
              <div className="text-[11px] text-sky-300/80 font-medium">
                Prob. Chuva: 0% · {latestFeira?.estimatedVisitors || 3200} visitantes previstos
              </div>
            </div>
          </div>
        </div>

        {/* Action Tabs with Van Gogh Impasto Styling */}
        <div className="relative z-10 px-6 sm:px-8 py-4 bg-[#070D1E]/80 border-t border-amber-400/15 flex items-center flex-wrap gap-3">
          <button
            onClick={() => setActiveTab('mapa')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(245,183,49,0.25)] transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Praça das Estrelas (Mapa)</span>
          </button>

          <button
            onClick={() => setActiveTab('edicoes')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-950/60 hover:bg-sky-900/60 text-sky-200 text-xs font-semibold border border-sky-500/30 transition-all cursor-pointer"
          >
            <Store className="w-3.5 h-3.5 text-sky-400" />
            <span>Chamada da Noite</span>
          </button>

          <button
            onClick={() => setActiveTab('cobrancas')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
            <span>Cobranças & Pix ({pendingDebts.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Key Executive Metric Cards (Deep Cobalt & Radiant Cadmium Gold) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Receita Bruta */}
        <div className="bg-[#0E1A38]/90 border border-amber-400/20 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-amber-400/40 transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-amber-200/80 uppercase tracking-wider mb-2">
            <span>Receita Bruta Total</span>
            <div className="w-7 h-7 rounded-lg bg-amber-400/15 text-amber-300 flex items-center justify-center border border-amber-400/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-300 tracking-tight drop-shadow-[0_0_10px_rgba(245,183,49,0.3)]">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.totalReceitaBruta)}
          </div>
          <div className="mt-2 text-[11px] text-slate-300 flex items-center justify-between pt-2 border-t border-slate-700/60 font-mono">
            <span className="text-sky-300">Pix: {metrics.totalPixArrecadado.toFixed(0)}</span>
            <span className="text-emerald-300">Espécie: {metrics.totalDinheiroArrecadado.toFixed(0)}</span>
          </div>
        </div>

        {/* Custos Operacionais */}
        <div className="bg-[#0E1A38]/90 border border-slate-700/70 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-rose-400/30 transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-rose-300 uppercase tracking-wider mb-2">
            <span>Despesas Operacionais</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-300 flex items-center justify-center border border-rose-500/30">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-rose-400 tracking-tight">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.totalDespesasOperacionais)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-slate-700/60">
            Som acústico, limpeza, energia e sanitários
          </div>
        </div>

        {/* Saldo Líquido */}
        <div className="bg-[#0E1A38]/90 border border-amber-400/20 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-amber-400/40 transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
            <span>Saldo Líquido Geral</span>
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.saldoLiquidoGeral)}
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 pt-2 border-t border-slate-700/60 flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Resultado líquido da organização</span>
          </div>
        </div>

        {/* Taxa de Adimplência */}
        <div className="bg-[#0E1A38]/90 border border-sky-400/20 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-sky-400/40 transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">
            <span>Taxa de Adimplência</span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-300 flex items-center justify-center border border-sky-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-sky-300 tracking-tight">
            {metrics.taxaAdimplencia}%
          </div>
          <div className="mt-2 text-[11px] text-slate-300 pt-2 border-t border-slate-700/60 flex items-center justify-between">
            <span>Em aberto:</span>
            <span className="font-mono font-bold text-rose-400">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPendente)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Comparative Financial Chart & Urgent Debt Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Evolution Chart (2 cols on lg) */}
        <div className="lg:col-span-2 bg-[#0E1A38]/90 border border-amber-400/20 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-300" />
                <span>Desempenho por Edição (Arrecadação vs Despesas)</span>
              </h3>
              <p className="text-xs text-sky-200/70">
                Histórico financeiro das noites de feira realizadas na praça.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F5B731]"></span> Receita
              </span>
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> Custos
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization with Van Gogh Palette */}
          <div className="pt-4 space-y-4">
            {recentFeiras.map(feira => {
              const rec = Object.values(feira.entries).reduce((sum, e) => sum + (e.isPaid ? e.value : 0), 0);
              const exp = feira.expenses.reduce((sum, e) => sum + e.amount, 0);
              const net = rec - exp;
              const recWidth = Math.min(100, Math.round((rec / maxRevenue) * 100));
              const expWidth = Math.min(100, Math.round((exp / maxRevenue) * 100));

              return (
                <div key={feira.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white font-mono flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      {feira.displayDate}
                    </span>
                    <span className="font-mono text-slate-300">
                      Líquido: <span className={net >= 0 ? 'text-amber-300 font-bold' : 'text-rose-400 font-bold'}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(net)}
                      </span>
                    </span>
                  </div>

                  {/* Dual Bar */}
                  <div className="space-y-1.5 bg-[#070D1E]/90 p-2.5 rounded-xl border border-slate-800">
                    {/* Revenue Bar (Cadmium Yellow Swirl) */}
                    <div className="flex items-center gap-2">
                      <div className="w-14 text-[10px] text-slate-400 font-mono text-right">Receita</div>
                      <div className="flex-1 bg-slate-800/80 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(245,183,49,0.4)]"
                          style={{ width: `${recWidth}%` }}
                        />
                      </div>
                      <div className="w-20 text-[11px] font-mono text-amber-300 font-bold text-right">
                        R$ {rec.toFixed(0)}
                      </div>
                    </div>

                    {/* Expense Bar (Prussian Cobalt Blue) */}
                    <div className="flex items-center gap-2">
                      <div className="w-14 text-[10px] text-slate-400 font-mono text-right">Custos</div>
                      <div className="flex-1 bg-slate-800/80 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-700 to-sky-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${expWidth}%` }}
                        />
                      </div>
                      <div className="w-20 text-[11px] font-mono text-sky-300 font-bold text-right">
                        R$ {exp.toFixed(0)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Urgent Collection Action Box (1 col on lg) */}
        <div className="bg-[#0E1A38]/90 border border-amber-400/20 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">Pendências de Cobrança</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60 font-mono font-bold text-xs">
                {pendingDebts.length} em aberto
              </span>
            </div>

            <p className="text-xs text-sky-200/70 leading-relaxed">
              Barracas com taxa diária em aberto aguardando acerto financeiro via Pix oficial.
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {pendingDebts.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                  Nenhum feirante pendente. Praça regularizada!
                </div>
              ) : (
                pendingDebts.slice(0, 4).map(debt => (
                  <div
                    key={debt.id}
                    className="p-3 rounded-xl bg-[#070D1E]/90 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white line-clamp-1">{debt.feiranteName}</div>
                      <div className="text-[10px] text-amber-200/70 font-mono">
                        {debt.feiraDate} · Ponto {debt.stallNumber}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-rose-400">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(debt.pendingValue)}
                      </div>
                      <span className="text-[10px] text-amber-300">Aguardando Pix</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('cobrancas')}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Abrir Cobranças & Pix</span>
            </button>
          </div>
        </div>

      </div>

      {/* 4. Pre-opening Inspection Checklist */}
      <div className="bg-[#0E1A38]/90 border border-amber-400/20 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Vistoria & Liberação da Praça das Estrelas</h3>
              <p className="text-xs text-sky-200/70">
                Itens de segurança, quadros elétricos de 110V/220V e suporte para a noite de feira.
              </p>
            </div>
          </div>

          <div className="text-xs text-amber-300 font-semibold flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Praça Liberada</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
          <div className="p-3.5 rounded-xl bg-[#070D1E]/90 border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-white block">Quadros Elétricos 110V/220V</span>
              <span className="text-slate-400 text-[11px]">Cabos aéreos protegidos e gerador reserva em stand-by.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070D1E]/90 border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-white block">Sanitários & Higiene</span>
              <span className="text-slate-400 text-[11px]">Banheiros químicos higienizados e pontos de água abastecidos.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#070D1E]/90 border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-white block">Fiscais de Pátio</span>
              <span className="text-slate-400 text-[11px]">Monitores posicionados nos portões de acesso.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
