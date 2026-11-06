import React, { useState } from 'react';
import { useFeira } from '../context/FeiraContext';
import { PendingDebtItem } from '../types/feira';
import { PaymentModal } from './PaymentModal';
import { 
  MessageSquare, 
  Receipt, 
  QrCode, 
  CheckCircle2, 
  Search, 
  Copy, 
  Check, 
  ExternalLink,
  Calendar,
  Sparkles,
  Moon
} from 'lucide-react';

export const CobrancasView: React.FC = () => {
  const { pendingDebts, updateFeirante } = useFeira();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDebt, setSelectedDebt] = useState<PendingDebtItem | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [editingPhoneId, setEditingPhoneId] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState('');

  const officialPixKey = 'pix@feiradalua.com.br';
  const totalPendente = pendingDebts.reduce((sum, item) => sum + item.pendingValue, 0);

  const filteredDebts = pendingDebts.filter(d => 
    d.feiranteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.stallNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.feiraDate.includes(searchTerm)
  );

  const handleCopyPix = () => {
    navigator.clipboard.writeText(officialPixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleSendWhatsApp = (debt: PendingDebtItem) => {
    if (!debt.phone) return;
    const cleanPhone = debt.phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá ${debt.feiranteName}! Aqui é da Coordenação da Feira da Lua 🌙.\n\n` +
      `Consta em aberto a taxa diária de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(debt.pendingValue)} referente à feira do dia ${debt.feiraDate} (Ponto ${debt.stallNumber}).\n\n` +
      `🔑 Chave PIX Oficial: ${officialPixKey}\n` +
      `Favorecido: Feira da Lua Organização\n\n` +
      `Por favor, nos envie o comprovante assim que realizar o pagamento. Muito obrigado!`
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
  };

  const handleSavePhone = (feiranteId: string) => {
    if (phoneInput.trim()) {
      updateFeirante(feiranteId, { phone: phoneInput.trim() });
    }
    setEditingPhoneId(null);
    setPhoneInput('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with Pix Box & Debt Overview */}
      <div className="bg-[#0E1A38]/90 border border-amber-400/20 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#F43F5E]"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Central de Cobranças</span>
              <span className="text-amber-300 font-artistic italic text-2xl font-normal">· Notificações WhatsApp & Pix</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-sky-200/70 mt-1 max-w-xl">
            Régua de lembretes para acerto de taxas, disparo de cobrança e chave Pix da organização.
          </p>
        </div>

        {/* Golden Pix Key Badge */}
        <div className="bg-[#070D1E]/95 border border-amber-400/30 rounded-2xl p-3.5 flex items-center gap-3.5 w-full lg:w-auto shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(245,183,49,0.3)]">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-200/80 uppercase tracking-wider block font-artistic italic text-sm">
              Chave Pix Oficial
            </span>
            <span className="text-xs font-mono font-bold text-white block">
              {officialPixKey}
            </span>
          </div>
          <button
            onClick={handleCopyPix}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors cursor-pointer border border-amber-400/30 shadow-xs"
            title="Copiar Chave Pix"
          >
            {copiedPix ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0E1A38]/90 border border-rose-500/20 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <span className="text-xs font-bold text-rose-300 uppercase tracking-wider block">Total em Atraso</span>
          <span className="text-2xl sm:text-3xl font-mono font-bold text-rose-400 mt-1 block">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPendente)}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Soma de taxas diárias não compensadas
          </span>
        </div>

        <div className="bg-[#0E1A38]/90 border border-amber-400/20 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <span className="text-xs font-bold text-amber-200/80 uppercase tracking-wider block">Barracas Pendentes</span>
          <span className="text-2xl sm:text-3xl font-mono font-bold text-amber-300 mt-1 block">
            {new Set(pendingDebts.map(d => d.feiranteId)).size} barracas
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Em {pendingDebts.length} datas de feira
          </span>
        </div>

        <div className="bg-[#0E1A38]/90 border border-sky-400/20 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <span className="text-xs font-bold text-sky-300 uppercase tracking-wider block">Disparo de Cobrança</span>
          <span className="text-2xl sm:text-3xl font-bold text-white mt-1 block flex items-center gap-2">
            <span>WhatsApp</span>
            <span className="text-amber-300 font-artistic italic text-xl">1-Click</span>
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Mensagem formatada com data e chave de acerto
          </span>
        </div>
      </div>

      {/* 3. Debts Table & Actions */}
      <div className="bg-[#0E1A38]/90 border border-amber-400/20 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-white text-base">Relação de Cobranças em Aberto</h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar por barraca, ponto ou data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#070D1E] border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredDebts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <h4 className="font-bold text-white text-sm">Nenhuma cobrança pendente!</h4>
              <p className="text-xs text-slate-400 mt-1">Todas as barracas estão em dia com as taxas da feira.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-sky-200/80 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Edição (Data)</th>
                  <th className="py-3 px-3">Barraca / Feirante</th>
                  <th className="py-3 px-2">Ponto</th>
                  <th className="py-3 px-3">WhatsApp</th>
                  <th className="py-3 px-3 text-right">Valor em Aberto</th>
                  <th className="py-3 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredDebts.map(debt => (
                  <tr key={debt.id} className="hover:bg-slate-800/25 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{debt.feiraDate}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-medium text-slate-100">
                      <div>{debt.feiranteName}</div>
                      <span className="text-[10px] text-amber-200/60 font-normal">{debt.sector}</span>
                    </td>

                    <td className="py-3 px-2 font-mono font-bold text-amber-300">
                      {debt.stallNumber}
                    </td>

                    <td className="py-3 px-3">
                      {editingPhoneId === debt.feiranteId ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="(11) 9..."
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            className="w-28 bg-[#070D1E] border border-amber-400 rounded px-2 py-0.5 text-xs text-white"
                          />
                          <button
                            onClick={() => handleSavePhone(debt.feiranteId)}
                            className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-bold text-[10px]"
                          >
                            OK
                          </button>
                        </div>
                      ) : debt.phone ? (
                        <span className="font-mono text-slate-300">{debt.phone}</span>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingPhoneId(debt.feiranteId);
                            setPhoneInput('');
                          }}
                          className="text-[11px] text-amber-300 hover:underline"
                        >
                          + Adicionar WhatsApp
                        </button>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-rose-400 text-sm">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(debt.pendingValue)}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {debt.phone && (
                          <button
                            onClick={() => handleSendWhatsApp(debt)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold transition-all cursor-pointer text-xs"
                            title="Cobrar via WhatsApp"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                            <span>WhatsApp</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedDebt(debt)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Dar Baixa</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedDebt && (
        <PaymentModal debt={selectedDebt} onClose={() => setSelectedDebt(null)} />
      )}
    </div>
  );
};
