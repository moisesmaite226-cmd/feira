import React, { useState } from 'react';
import { useFeira } from '../context/FeiraContext';
import { Feirante } from '../types/feira';
import { FeiranteModal } from './FeiranteModal';
import { 
  Users, 
  Plus, 
  Search, 
  MessageSquare, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Zap,
  Sparkles
} from 'lucide-react';

export const FeirantesView: React.FC = () => {
  const { feirantes, feiras, deleteFeirante, pendingDebts } = useFeira();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeirante, setEditingFeirante] = useState<Feirante | null>(null);

  const categories = ['Todas', ...Array.from(new Set(feirantes.map(f => f.category)))];

  const filteredFeirantes = feirantes.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.stallNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.phone.includes(searchTerm);
    const matchesCategory = selectedCategory === 'Todas' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFeiranteDebt = (feiranteId: string) => {
    return pendingDebts
      .filter(d => d.feiranteId === feiranteId)
      .reduce((sum, d) => sum + d.pendingValue, 0);
  };

  const getFeiranteTotalPaid = (feiranteId: string) => {
    let total = 0;
    feiras.forEach(feira => {
      const entry = feira.entries[feiranteId];
      if (entry?.isPaid) {
        total += entry.value;
      }
    });
    return total;
  };

  const handleEdit = (feirante: Feirante) => {
    setEditingFeirante(feirante);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja remover ${name} do sistema?`)) {
      deleteFeirante(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-[#0E1A38]/90 border border-amber-400/20 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F5B731]"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Feirantes & Barracas</span>
              <span className="text-amber-300 font-artistic italic text-2xl font-normal">· Diretório</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-sky-200/70 mt-1">
            Controle cadastral, pontos na praça, categorias e histórico de pagamento de cada barraca da Feira da Lua.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingFeirante(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(245,183,49,0.25)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Feirante</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0E1A38]/90 border border-amber-400/20 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome, ponto ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#070D1E] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-amber-400"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(245,183,49,0.3)]'
                  : 'bg-[#070D1E] text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feirantes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeirantes.map(feirante => {
          const debt = getFeiranteDebt(feirante.id);
          const totalPaid = getFeiranteTotalPaid(feirante.id);
          const hasDebt = debt > 0;

          return (
            <div
              key={feirante.id}
              className={`bg-[#0E1A38]/90 border rounded-2xl p-5 shadow-xl backdrop-blur-md transition-all flex flex-col justify-between ${
                hasDebt
                  ? 'border-rose-500/40 hover:border-rose-500/60'
                  : 'border-amber-400/20 hover:border-amber-400/40'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold font-mono text-sm shrink-0 shadow-[0_0_10px_rgba(245,183,49,0.25)]">
                      {feirante.stallNumber}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm line-clamp-1">
                        {feirante.name}
                      </h3>
                      <span className="text-[11px] text-amber-200/70 font-artistic italic text-sm">
                        {feirante.category} · {feirante.sector}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(feirante)}
                      className="text-slate-400 hover:text-amber-300 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(feirante.id, feirante.name)}
                      className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Contact & Technical Info */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Contato:</span>
                    {feirante.phone ? (
                      <a
                        href={`https://wa.me/55${feirante.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono font-medium"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>{feirante.phone}</span>
                      </a>
                    ) : (
                      <span className="text-slate-500 italic">Sem telefone</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Taxa Padrão:</span>
                    <span className="text-amber-300 font-mono font-bold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(feirante.defaultFee)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Energia:</span>
                    <span className="text-slate-200 font-mono text-[11px] flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      {feirante.powerDemand}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Status Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Pago</span>
                    <span className="font-mono font-bold text-slate-200">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPaid)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Situação</span>
                    {hasDebt ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800 font-mono shadow-[0_0_8px_rgba(244,63,94,0.3)]">
                        <AlertCircle className="w-3 h-3 text-rose-400" />
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(debt)} em aberto
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        Regularizado
                      </span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      <FeiranteModal
        feirante={editingFeirante}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFeirante(null);
        }}
      />
    </div>
  );
};
