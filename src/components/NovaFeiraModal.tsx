import React, { useState } from 'react';
import { useFeira } from '../context/FeiraContext';
import { X, Calendar, Plus } from 'lucide-react';

interface NovaFeiraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NovaFeiraModal: React.FC<NovaFeiraModalProps> = ({ isOpen, onClose }) => {
  const { addFeira, feirantes } = useFeira();
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [somExpense, setSomExpense] = useState(150);
  const [limpezaExpense, setLimpezaExpense] = useState(200);
  const [fiscalExpense, setFiscalExpense] = useState(90);
  const [luzExpense, setLuzExpense] = useState(90);
  const [banheiroExpense, setBanheiroExpense] = useState(350);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    const [year, month, day] = date.split('-');
    const displayDate = `${day}/${month}/${year}`;
    const shortDate = `${day}/${month}`;

    const entries: Record<string, any> = {};
    feirantes.forEach(f => {
      entries[f.id] = {
        feiranteId: f.id,
        status: 'presente',
        paymentMethod: 'pix',
        isPaid: true,
        value: f.defaultFee
      };
    });

    const expenses = [
      { id: 'exp-som', category: 'som' as const, description: 'Sonorização & DJ', amount: Number(somExpense) },
      { id: 'exp-limpeza', category: 'limpeza' as const, description: 'Equipe de Limpeza Contínua', amount: Number(limpezaExpense) },
      { id: 'exp-fiscal', category: 'fiscal' as const, description: 'Fiscais de Pátio & Segurança', amount: Number(fiscalExpense) },
      { id: 'exp-luz', category: 'luz' as const, description: 'Quadro de Luz & Gerador', amount: Number(luzExpense) },
      { id: 'exp-banheiro', category: 'banheiro' as const, description: 'Banheiros Químicos & Manutenção', amount: Number(banheiroExpense) }
    ];

    addFeira({
      date,
      displayDate,
      shortDate,
      status: 'realizada',
      systemOk: false,
      entries,
      expenses,
      notes: `Edição criada em ${new Date().toLocaleDateString('pt-BR')}`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0E1A38] border border-amber-400/30 rounded-2xl shadow-[0_0_50px_rgba(245,183,49,0.15)] p-6 text-slate-100 overflow-hidden">
        {/* Artistic corner glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-amber-400/10 blur-2xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-amber-300 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-[0_0_12px_rgba(245,183,49,0.25)]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Cadastrar Nova Edição da Feira</h3>
            <p className="text-xs text-sky-200/70">Agendar data sob o luar e provisionar presenças das barracas</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-amber-200/80 block mb-1">
              Data da Edição *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#070D1E] border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 rounded-xl px-3.5 py-2 text-sm text-amber-200 font-mono outline-none transition-all"
            />
          </div>

          <div className="border-t border-slate-800/80 pt-3">
            <h4 className="text-xs font-semibold text-amber-300 block mb-2 flex items-center gap-1.5">
              <span>Estimativa de Despesas Operacionais (R$)</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Som / DJ</label>
                <input
                  type="number"
                  value={somExpense}
                  onChange={(e) => setSomExpense(Number(e.target.value))}
                  className="w-full bg-[#070D1E] border border-slate-700/80 rounded-lg px-3 py-1.5 text-amber-100 font-mono outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Limpeza & Coleta</label>
                <input
                  type="number"
                  value={limpezaExpense}
                  onChange={(e) => setLimpezaExpense(Number(e.target.value))}
                  className="w-full bg-[#070D1E] border border-slate-700/80 rounded-lg px-3 py-1.5 text-amber-100 font-mono outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Fiscal / Segurança</label>
                <input
                  type="number"
                  value={fiscalExpense}
                  onChange={(e) => setFiscalExpense(Number(e.target.value))}
                  className="w-full bg-[#070D1E] border border-slate-700/80 rounded-lg px-3 py-1.5 text-amber-100 font-mono outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Luz / Gerador</label>
                <input
                  type="number"
                  value={luzExpense}
                  onChange={(e) => setLuzExpense(Number(e.target.value))}
                  className="w-full bg-[#070D1E] border border-slate-700/80 rounded-lg px-3 py-1.5 text-amber-100 font-mono outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 block mb-1">Banheiros Químicos & Manutenção</label>
                <input
                  type="number"
                  value={banheiroExpense}
                  onChange={(e) => setBanheiroExpense(Number(e.target.value))}
                  className="w-full bg-[#070D1E] border border-slate-700/80 rounded-lg px-3 py-1.5 text-amber-100 font-mono outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(245,183,49,0.3)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Edição</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
