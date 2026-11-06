import React, { useState, useEffect } from 'react';
import { useFeira } from '../context/FeiraContext';
import { Feirante, FairSector } from '../types/feira';
import { X, Store } from 'lucide-react';

interface FeiranteModalProps {
  feirante: Feirante | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FeiranteModal: React.FC<FeiranteModalProps> = ({ feirante, isOpen, onClose }) => {
  const { addFeirante, updateFeirante } = useFeira();

  const [name, setName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [category, setCategory] = useState('Gastronomia');
  const [sector, setSector] = useState<FairSector>('Setor A - Gastronomia');
  const [phone, setPhone] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [stallNumber, setStallNumber] = useState('');
  const [defaultFee, setDefaultFee] = useState(55);
  const [powerDemand, setPowerDemand] = useState<'110V' | '220V' | 'Bivolt' | 'Isento de Energia'>('110V');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (feirante) {
      setName(feirante.name);
      setLegalName(feirante.legalName || '');
      setCategory(feirante.category);
      setSector(feirante.sector || 'Setor A - Gastronomia');
      setPhone(feirante.phone || '');
      setPixKey(feirante.pixKey || '');
      setStallNumber(feirante.stallNumber || '');
      setDefaultFee(feirante.defaultFee || 55);
      setPowerDemand(feirante.powerDemand || '110V');
      setNotes(feirante.notes || '');
    } else {
      setName('');
      setLegalName('');
      setCategory('Gastronomia');
      setSector('Setor A - Gastronomia');
      setPhone('');
      setPixKey('');
      setStallNumber('');
      setDefaultFee(55);
      setPowerDemand('110V');
      setNotes('');
    }
  }, [feirante, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (feirante) {
      updateFeirante(feirante.id, {
        name: name.trim(),
        legalName: legalName.trim(),
        category,
        sector,
        phone: phone.trim(),
        pixKey: pixKey.trim(),
        stallNumber: stallNumber.trim() || 'A-01',
        defaultFee: Number(defaultFee),
        powerDemand,
        notes: notes.trim()
      });
    } else {
      addFeirante({
        name: name.trim(),
        legalName: legalName.trim(),
        category,
        sector,
        mapPosition: { x: 50, y: 50 },
        powerDemand,
        healthPermitValid: true,
        phone: phone.trim(),
        pixKey: pixKey.trim(),
        stallNumber: stallNumber.trim() || 'A-01',
        defaultFee: Number(defaultFee),
        status: 'ativo',
        notes: notes.trim()
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0E1A38] border border-amber-400/30 rounded-2xl shadow-[0_0_50px_rgba(245,183,49,0.15)] p-6 text-slate-100 overflow-hidden">
        {/* Artistic corner glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-amber-400/10 blur-2xl pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-amber-300 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-[0_0_12px_rgba(245,183,49,0.25)]">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{feirante ? 'Editar Barraca / Feirante' : 'Cadastrar Novo Feirante'}</span>
            </h3>
            <p className="text-xs text-sky-200/70">Dados cadastrais, setor na praça e especificações técnicas</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-amber-200/80 block mb-1">
              Nome da Barraca / Nome Fantasia *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Pastel da Cida"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#070D1E] border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 rounded-xl px-3 py-2 text-xs text-amber-100 placeholder-slate-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-amber-200/80 block mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#070D1E] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-amber-100 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
              >
                <option value="Gastronomia" className="bg-[#070D1E] text-white">Gastronomia</option>
                <option value="Doces & Sobremesas" className="bg-[#070D1E] text-white">Doces & Sobremesas</option>
                <option value="Bebidas & Chopp" className="bg-[#070D1E] text-white">Bebidas & Chopp</option>
                <option value="Artesanato & Design" className="bg-[#070D1E] text-white">Artesanato & Design</option>
                <option value="Espaço Kids" className="bg-[#070D1E] text-white">Espaço Kids</option>
                <option value="Arte & Cultura" className="bg-[#070D1E] text-white">Arte & Cultura</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-amber-200/80 block mb-1">
                Ponto / Barraca
              </label>
              <input
                type="text"
                placeholder="Ex: A-01, B-04"
                value={stallNumber}
                onChange={(e) => setStallNumber(e.target.value)}
                className="w-full bg-[#070D1E] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono font-bold outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 placeholder-slate-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-amber-200/80 block mb-1">
              Setor da Praça
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value as FairSector)}
              className="w-full bg-[#070D1E] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-amber-100 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
            >
              <option value="Setor A - Gastronomia" className="bg-[#070D1E] text-white">Setor A - Gastronomia</option>
              <option value="Setor B - Chopp & Bebidas" className="bg-[#070D1E] text-white">Setor B - Chopp & Bebidas</option>
              <option value="Setor C - Artesanato & Design" className="bg-[#070D1E] text-white">Setor C - Artesanato & Design</option>
              <option value="Setor D - Espaço Kids" className="bg-[#070D1E] text-white">Setor D - Espaço Kids</option>
              <option value="Setor E - Boulevard & Arte" className="bg-[#070D1E] text-white">Setor E - Boulevard & Arte</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-amber-200/80 block mb-1">
                WhatsApp / Telefone
              </label>
              <input
                type="text"
                placeholder="(11) 98765-4321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#070D1E] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-amber-100 font-mono outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 placeholder-slate-500 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-amber-200/80 block mb-1">
                Taxa Diária (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={defaultFee}
                onChange={(e) => setDefaultFee(Number(e.target.value))}
                className="w-full bg-[#070D1E] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono font-bold outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-amber-200/80 block mb-1">
                Energia Elétrica
              </label>
              <select
                value={powerDemand}
                onChange={(e) => setPowerDemand(e.target.value as any)}
                className="w-full bg-[#070D1E] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-amber-100 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
              >
                <option value="110V" className="bg-[#070D1E] text-white">110V</option>
                <option value="220V" className="bg-[#070D1E] text-white">220V</option>
                <option value="Bivolt" className="bg-[#070D1E] text-white">Bivolt</option>
                <option value="Isento de Energia" className="bg-[#070D1E] text-white">Isento de Energia</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-amber-200/80 block mb-1">
                Chave PIX
              </label>
              <input
                type="text"
                placeholder="CPF ou e-mail"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                className="w-full bg-[#070D1E] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-amber-100 font-mono outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 placeholder-slate-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-amber-200/80 block mb-1">
              Observações
            </label>
            <textarea
              rows={2}
              placeholder="Detalhes sobre equipamentos, chapa, estufa ou freezer..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#070D1E] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-amber-100 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 placeholder-slate-500 transition-all resize-none"
            />
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
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(245,183,49,0.3)] transition-all cursor-pointer"
            >
              {feirante ? 'Salvar Alterações' : 'Cadastrar Feirante'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
