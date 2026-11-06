import React, { useState } from 'react';
import { useFeira } from '../context/FeiraContext';
import { PendingDebtItem, PaymentMethod } from '../types/feira';
import { X, CheckCircle2, QrCode, Banknote, ShieldAlert, Moon } from 'lucide-react';

interface PaymentModalProps {
  debt: PendingDebtItem | null;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ debt, onClose }) => {
  const { settleDebt } = useFeira();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('pix');
  const [amount, setAmount] = useState<number>(debt?.pendingValue || 0);

  if (!debt) return null;

  const handleConfirm = () => {
    settleDebt(debt.feiraId, debt.feiranteId, selectedMethod, Number(amount));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0E1A38] border border-amber-400/30 rounded-3xl shadow-2xl p-6 text-white overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_12px_rgba(245,183,49,0.3)]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Dar Baixa no Pagamento</span>
            </h3>
            <p className="text-xs text-sky-200/70 font-artistic italic text-sm">Registrar quitação sob o céu estrelado</p>
          </div>
        </div>

        {/* Debt Details */}
        <div className="bg-[#070D1E]/95 border border-slate-800 rounded-2xl p-4 mb-5 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Feirante:</span>
            <span className="font-semibold text-white">{debt.feiranteName}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Data da Feira:</span>
            <span className="font-mono font-medium text-amber-300">{debt.feiraDate}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Valor em Aberto:</span>
            <span className="font-bold text-rose-400 font-mono">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(debt.pendingValue)}
            </span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-2.5 mb-5">
          <label className="text-xs font-semibold text-amber-200/80 block font-artistic italic text-sm">
            Forma de Pagamento
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedMethod('pix')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                selectedMethod === 'pix'
                  ? 'border-sky-400 bg-sky-950/60 text-sky-200 font-semibold shadow-md shadow-sky-500/10'
                  : 'border-slate-800 bg-[#070D1E] text-slate-400 hover:border-slate-700'
              }`}
            >
              <QrCode className="w-4 h-4 mb-1 text-sky-400" />
              <span>PIX</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('dinheiro')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                selectedMethod === 'dinheiro'
                  ? 'border-emerald-400 bg-emerald-950/60 text-emerald-200 font-semibold shadow-md shadow-emerald-500/10'
                  : 'border-slate-800 bg-[#070D1E] text-slate-400 hover:border-slate-700'
              }`}
            >
              <Banknote className="w-4 h-4 mb-1 text-emerald-400" />
              <span>Dinheiro</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('pagou_lincon')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                selectedMethod === 'pagou_lincon'
                  ? 'border-amber-400 bg-amber-950/60 text-amber-200 font-semibold shadow-md shadow-amber-500/10'
                  : 'border-slate-800 bg-[#070D1E] text-slate-400 hover:border-slate-700'
              }`}
            >
              <ShieldAlert className="w-4 h-4 mb-1 text-amber-400" />
              <span>P. Lincon</span>
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-amber-200/80 block mb-1.5 font-artistic italic text-sm">
            Valor Recebido (R$)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 text-sm font-semibold">R$</span>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-[#070D1E] border border-amber-400/30 focus:border-amber-400 rounded-xl py-2 pl-10 pr-4 text-amber-300 text-sm font-bold outline-none transition-all font-mono"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(245,183,49,0.25)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar Baixa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
