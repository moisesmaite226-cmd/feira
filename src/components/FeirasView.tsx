import React, { useState } from 'react';
import { useFeira } from '../context/FeiraContext';
import { NovaFeiraModal } from './NovaFeiraModal';
import { AttendanceStatus, PaymentMethod } from '../types/feira';
import { 
  Calendar, 
  Plus, 
  DollarSign, 
  Users, 
  CreditCard, 
  Trash2, 
  Search,
  CheckCircle2,
  Check,
  Moon,
  Sparkles
} from 'lucide-react';

export const FeirasView: React.FC = () => {
  const { feiras, feirantes, selectedFeiraId, setSelectedFeiraId, updateEntry, updateFeira, addExpense, removeExpense } = useFeira();
  const [isNovaFeiraOpen, setIsNovaFeiraOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newExpCat, setNewExpCat] = useState<'som' | 'limpeza' | 'fiscal' | 'luz' | 'banheiro' | 'outros'>('outros');

  const selectedFeira = feiras.find(f => f.id === selectedFeiraId) || feiras[0];

  if (!selectedFeira) {
    return <div className="text-slate-400 p-6">Nenhuma feira cadastrada.</div>;
  }

  // Financial metrics for selected feira
  const totalArrecadado = Object.values(selectedFeira.entries).reduce((sum, e) => sum + (e.isPaid ? e.value : 0), 0);
  const totalPix = Object.values(selectedFeira.entries).reduce(
    (sum, e) => sum + (e.isPaid && (e.paymentMethod === 'pix' || e.paymentMethod === 'pagou_lincon') ? e.value : 0),
    0
  );
  const totalDinheiro = Object.values(selectedFeira.entries).reduce(
    (sum, e) => sum + (e.isPaid && e.paymentMethod === 'dinheiro' ? e.value : 0),
    0
  );
  const totalDespesas = selectedFeira.expenses.reduce((sum, e) => sum + e.amount, 0);
  const saldoLiquido = totalArrecadado - totalDespesas;
  const totalPendentes = Object.values(selectedFeira.entries).reduce(
    (sum, e) => sum + (!e.isPaid && e.paymentMethod === 'pendente' ? e.value : 0),
    0
  );
  const totalPresentes = Object.values(selectedFeira.entries).filter(e => e.status === 'presente').length;

  const filteredFeirantes = feirantes.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.stallNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpDesc || !newExpAmount) return;
    addExpense(selectedFeira.id, {
      description: newExpDesc,
      category: newExpCat,
      amount: Number(newExpAmount)
    });
    setNewExpDesc('');
    setNewExpAmount('');
  };

  const toggleCancelFeira = () => {
    const isCancelada = selectedFeira.status === 'cancelada';
    if (window.confirm(isCancelada ? 'Reativar esta edição da Feira?' : 'Marcar esta edição como CANCELADA (chuva/imprevisto)?')) {
      updateFeira(selectedFeira.id, {
        status: isCancelada ? 'realizada' : 'cancelada'
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & New Feira Button */}
      <div className="bg-[#0E1A38]/90 border border-amber-400/20 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F5B731]"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Noite de Feira</span>
              <span className="text-amber-300 font-artistic italic text-2xl font-normal">· Chamada & Caixa</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-sky-200/70 mt-1">
            Selecione uma data para conferir a presença das barracas, pagamentos e despesas sob a luz das estrelas.
          </p>
        </div>

        <button
          onClick={() => setIsNovaFeiraOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(245,183,49,0.25)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Feira</span>
        </button>
      </div>

      {/* Editions Carousel with Van Gogh Midnight Styling */}
      <div className="bg-[#0E1A38]/90 border border-amber-400/20 rounded-2xl p-4 shadow-xl backdrop-blur-md">
        <div className="text-xs font-bold text-amber-200/90 font-artistic italic text-sm mb-2.5 flex items-center justify-between">
          <span>Selecione a Edição ({feiras.length} noites catalogadas)</span>
          <span className="text-slate-400 font-mono text-[11px] not-italic">Ordem cronológica</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {feiras.map(f => {
            const isSelected = f.id === selectedFeira.id;
            const isCancelada = f.status === 'cancelada';

            return (
              <button
                key={f.id}
                onClick={() => setSelectedFeiraId(f.id)}
                className={`flex flex-col items-center min-w-[92px] py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-gradient-to-b from-amber-400/20 to-sky-900/40 text-amber-200 ring-2 ring-amber-400/50 shadow-[0_0_15px_rgba(245,183,49,0.3)]'
                    : isCancelada
                    ? 'border-rose-900/60 bg-rose-950/30 text-rose-300 hover:bg-rose-950/50'
                    : 'border-slate-800 bg-[#070D1E]/80 text-slate-300 hover:text-white hover:border-amber-400/30'
                }`}
              >
                <span className="text-sm font-mono font-bold">{f.shortDate}</span>
                <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-amber-300 font-bold' : isCancelada ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
                  {isCancelada ? 'Cancelada' : 'Realizada'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Feira Details */}
      <div className="bg-[#0E1A38]/90 border border-amber-400/20 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-base shadow-md ${
              selectedFeira.status === 'cancelada'
                ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
                : 'bg-gradient-to-br from-amber-400/30 to-sky-600/30 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(245,183,49,0.25)]'
            }`}>
              {selectedFeira.shortDate}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  Noite de {selectedFeira.displayDate}
                </h3>
                {selectedFeira.status === 'cancelada' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    CANCELADA (CHUVA)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                    REALIZADA
                  </span>
                )}
              </div>
              <p className="text-xs text-sky-200/70 mt-0.5">
                {selectedFeira.notes || 'Controle de chamada e prestação sob o céu estrelado'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleCancelFeira}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                selectedFeira.status === 'cancelada'
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-300 hover:bg-rose-900/60'
              }`}
            >
              {selectedFeira.status === 'cancelada' ? 'Reativar Feira' : 'Cancelar Edição (Chuva)'}
            </button>
          </div>
        </div>

        {/* Night KPI Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-5">
          <div className="bg-[#070D1E]/90 border border-slate-800 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-amber-200/80 block">
              Arrecadação Bruta
            </span>
            <span className="text-xl font-mono font-bold text-amber-300 mt-1 block">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalArrecadado)}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Pix: {totalPix.toFixed(0)} | Dinheiro: {totalDinheiro.toFixed(0)}
            </span>
          </div>

          <div className="bg-[#070D1E]/90 border border-slate-800 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-rose-400 block">
              Custos da Noite
            </span>
            <span className="text-xl font-mono font-bold text-rose-400 mt-1 block">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalDespesas)}
            </span>
            <span className="text-[10px] text-slate-400">
              {selectedFeira.expenses.length} itens registrados
            </span>
          </div>

          <div className="bg-[#070D1E]/90 border border-slate-800 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-amber-300 block">
              Resultado Líquido
            </span>
            <span className={`text-xl font-mono font-bold mt-1 block ${saldoLiquido >= 0 ? 'text-amber-300' : 'text-rose-400'}`}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoLiquido)}
            </span>
            <span className="text-[10px] text-slate-400">
              Saldo final da noite
            </span>
          </div>

          <div className="bg-[#070D1E]/90 border border-slate-800 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-sky-300 block">
              Presença de Barracas
            </span>
            <span className="text-xl font-mono font-bold text-sky-300 mt-1 block">
              {totalPresentes} / {feirantes.length}
            </span>
            <span className="text-[10px] text-rose-400 font-mono">
              Pendente: R$ {totalPendentes.toFixed(2)}
            </span>
          </div>
        </div>

        {/* 2 Columns: Feirantes Checklist & Night Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          
          {/* Main: Feirante Check-in & Payments (2 columns on lg) */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-300" />
                <span>Chamada de Barracas & Conferência</span>
              </h4>

              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar barraca..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#070D1E] border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#070D1E]">
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-[#091228] border-b border-slate-800 text-sky-200/80 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Barraca / Feirante</th>
                      <th className="py-2.5 px-2">Ponto</th>
                      <th className="py-2.5 px-2">Presença</th>
                      <th className="py-2.5 px-2">Pagamento</th>
                      <th className="py-2.5 px-3 text-right">Valor (R$)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredFeirantes.map(feirante => {
                      const entry = selectedFeira.entries[feirante.id] || {
                        feiranteId: feirante.id,
                        status: 'presente',
                        paymentMethod: 'pix',
                        isPaid: true,
                        value: feirante.defaultFee
                      };

                      return (
                        <tr key={feirante.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-2.5 px-3 font-medium text-slate-100">
                            <div>{feirante.name}</div>
                            <span className="text-[10px] text-slate-400 font-normal">{feirante.category}</span>
                          </td>
                          <td className="py-2.5 px-2 font-mono text-amber-300 font-bold">
                            {feirante.stallNumber}
                          </td>
                          <td className="py-2.5 px-2">
                            <select
                              value={entry.status}
                              onChange={(e) => updateEntry(selectedFeira.id, feirante.id, {
                                status: e.target.value as AttendanceStatus
                              })}
                              className={`rounded-lg px-2 py-1 text-[11px] font-medium outline-none cursor-pointer border ${
                                entry.status === 'presente'
                                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                                  : entry.status === 'atestado'
                                  ? 'bg-slate-800 border-slate-700 text-slate-300'
                                  : 'bg-rose-950/60 border-rose-800 text-rose-300'
                              }`}
                            >
                              <option value="presente">Presente</option>
                              <option value="falta">Falta</option>
                              <option value="atestado">Atestado</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-2">
                            <select
                              value={entry.paymentMethod}
                              onChange={(e) => {
                                const method = e.target.value as PaymentMethod;
                                updateEntry(selectedFeira.id, feirante.id, {
                                  paymentMethod: method,
                                  isPaid: method !== 'pendente'
                                });
                              }}
                              className={`rounded-lg px-2 py-1 text-[11px] font-medium outline-none cursor-pointer border ${
                                entry.paymentMethod === 'pix'
                                  ? 'bg-sky-950/60 border-sky-500/40 text-sky-200'
                                  : entry.paymentMethod === 'dinheiro'
                                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                                  : entry.paymentMethod === 'pagou_lincon'
                                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                                  : entry.paymentMethod === 'isento'
                                  ? 'bg-slate-800 border-slate-700 text-slate-300'
                                  : 'bg-rose-950/80 border-rose-500/60 text-rose-300 font-bold'
                              }`}
                            >
                              <option value="pix">PIX</option>
                              <option value="dinheiro">Dinheiro</option>
                              <option value="pagou_lincon">P. Lincon</option>
                              <option value="pendente">Pendente</option>
                              <option value="isento">Isento</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <input
                              type="number"
                              step="0.01"
                              value={entry.value}
                              onChange={(e) => updateEntry(selectedFeira.id, feirante.id, {
                                value: Number(e.target.value)
                              })}
                              className="w-20 bg-[#0A1226] border border-slate-700 focus:border-amber-400 rounded-lg px-2 py-1 text-right text-xs font-mono font-bold text-amber-300 outline-none"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Side: Expenses & Night Costs (1 column on lg) */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-rose-400" />
                <span>Despesas da Feira</span>
              </span>
              <span className="text-xs font-mono text-rose-400 font-bold">
                Total: R$ {totalDespesas.toFixed(2)}
              </span>
            </h4>

            {/* List of current expenses */}
            <div className="bg-[#070D1E] border border-slate-800 rounded-2xl p-3 space-y-2">
              {selectedFeira.expenses.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">Nenhuma despesa cadastrada.</p>
              ) : (
                selectedFeira.expenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-[#0E1A38] border border-slate-800 shadow-sm"
                  >
                    <div>
                      <span className="text-slate-200 font-medium block">{exp.description}</span>
                      <span className="text-[10px] text-amber-200/60 uppercase">{exp.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-rose-400">
                        R$ {exp.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeExpense(selectedFeira.id, exp.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Excluir custo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add New Expense Form */}
            <form onSubmit={handleAddCustomExpense} className="bg-[#070D1E] border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
              <span className="text-xs font-bold text-amber-300 block font-artistic italic text-sm">
                + Adicionar Despesa da Noite
              </span>

              <div>
                <input
                  type="text"
                  placeholder="Descrição (ex: Iluminação, Gerador...)"
                  value={newExpDesc}
                  onChange={(e) => setNewExpDesc(e.target.value)}
                  className="w-full bg-[#0E1A38] border border-slate-700 focus:border-amber-400 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newExpCat}
                  onChange={(e) => setNewExpCat(e.target.value as any)}
                  className="bg-[#0E1A38] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                >
                  <option value="som">Som / DJ</option>
                  <option value="limpeza">Limpeza</option>
                  <option value="fiscal">Fiscal</option>
                  <option value="luz">Luz</option>
                  <option value="banheiro">Banheiro</option>
                  <option value="outros">Outros</option>
                </select>

                <input
                  type="number"
                  step="0.01"
                  placeholder="Valor R$"
                  value={newExpAmount}
                  onChange={(e) => setNewExpAmount(e.target.value)}
                  className="bg-[#0E1A38] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 transition-all cursor-pointer"
              >
                Salvar Despesa
              </button>
            </form>
          </div>

        </div>
      </div>

      <NovaFeiraModal
        isOpen={isNovaFeiraOpen}
        onClose={() => setIsNovaFeiraOpen(false)}
      />
    </div>
  );
};
