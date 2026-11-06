import React, { useState } from 'react';
import { useFeira } from '../context/FeiraContext';
import { Feirante, FairSector } from '../types/feira';
import { 
  MapPin, 
  Store, 
  Zap, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Utensils, 
  Beer, 
  Sparkles, 
  Palette, 
  Gamepad2, 
  Radio, 
  Search,
  Moon
} from 'lucide-react';

export const MapaPracaView: React.FC = () => {
  const { feirantes, feiras, selectedFeiraId } = useFeira();
  const [selectedFeirante, setSelectedFeirante] = useState<Feirante | null>(feirantes[0] || null);
  const [filterSector, setFilterSector] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const currentFeira = feiras.find(f => f.id === selectedFeiraId) || feiras[0];

  const sectors: { key: string; label: string; icon: React.ReactNode }[] = [
    { key: 'Todos', label: 'Toda a Praça', icon: <MapPin className="w-3.5 h-3.5" /> },
    { key: 'Setor A - Gastronomia', label: 'Alameda Gastronômica', icon: <Utensils className="w-3.5 h-3.5 text-amber-300" /> },
    { key: 'Setor B - Chopp & Bebidas', label: 'Chopp & Bebidas', icon: <Beer className="w-3.5 h-3.5 text-sky-300" /> },
    { key: 'Setor C - Artesanato & Design', label: 'Artesanato & Design', icon: <Palette className="w-3.5 h-3.5 text-purple-300" /> },
    { key: 'Setor D - Espaço Kids', label: 'Espaço Kids', icon: <Gamepad2 className="w-3.5 h-3.5 text-emerald-300" /> },
    { key: 'Setor E - Boulevard & Arte', label: 'Boulevard das Telas', icon: <Sparkles className="w-3.5 h-3.5 text-rose-300" /> }
  ];

  const filteredFeirantes = feirantes.filter(f => {
    const matchesSector = filterSector === 'Todos' || f.sector === filterSector;
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.stallNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const getFeiranteNightStatus = (feiranteId: string) => {
    const entry = currentFeira?.entries[feiranteId];
    if (!entry) return { status: 'ausente', label: 'Ausente', badge: 'bg-slate-800 text-slate-400 border-slate-700' };
    if (!entry.isPaid && entry.paymentMethod === 'pendente') {
      return { status: 'pendente', label: 'Pendente R$', badge: 'bg-rose-950/80 text-rose-300 border-rose-500/60 ring-2 ring-rose-500/40 animate-pulse' };
    }
    return { status: 'pago', label: 'Regularizado', badge: 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-[0_0_10px_rgba(245,183,49,0.5)]' };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Filter Bar */}
      <div className="bg-[#0E1A38]/90 border border-amber-400/20 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#F5B731]"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Praça das Estrelas</span>
              <span className="text-amber-300 font-artistic italic text-2xl font-normal">· Mapa da Feira</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-sky-200/70 mt-1">
            Planta de ocupação das barracas e distribuição de energia na edição de <span className="font-semibold text-amber-300 font-mono">{currentFeira?.displayDate}</span>.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-300/70" />
          <input
            type="text"
            placeholder="Buscar por barraca ou ponto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#070E22] border border-amber-400/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-amber-400 transition-all font-sans"
          />
        </div>
      </div>

      {/* Sector Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {sectors.map(s => (
          <button
            key={s.key}
            onClick={() => setFilterSector(s.key)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterSector === s.key
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(245,183,49,0.3)]'
                : 'bg-[#0E1A38]/80 border border-slate-700/60 text-slate-300 hover:text-white hover:border-amber-400/30'
            }`}
          >
            {s.icon}
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Map Layout Canvas & Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Starry Night Plaza Map Board (2 cols on lg) */}
        <div className="lg:col-span-2 bg-[#091228] border border-amber-400/25 rounded-3xl p-5 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-between select-none">
          
          {/* Subtle Swirl Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#f6c44515_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Landmarks Top Bar */}
          <div className="relative z-10 flex items-center justify-between text-xs text-sky-200/80 pb-3 border-b border-amber-400/15">
            <div className="flex items-center gap-2 font-medium text-white">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#F5B731]"></span>
              <span>Portão Principal (Norte)</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0A1634] px-3 py-1 rounded-xl border border-amber-400/25 text-[11px] font-medium text-amber-300 shadow-[0_0_12px_rgba(245,183,49,0.15)]">
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-artistic italic text-sm">Palco das Estrelas</span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Banheiros Químicos & Água
            </div>
          </div>

          {/* Central Map Surface */}
          <div className="relative z-10 my-4 flex-1 min-h-[360px] bg-[#070D1E]/90 border border-amber-400/15 rounded-2xl p-4 relative overflow-hidden">
            
            {/* Van Gogh Impressionist Sector Zones */}
            <div className="absolute top-3 left-3 border border-amber-400/25 bg-amber-500/5 rounded-2xl p-2.5 w-[46%] h-[42%] pointer-events-none">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider font-artistic italic text-sm">
                Setor A: Gastronomia
              </span>
            </div>

            <div className="absolute top-3 right-3 border border-sky-400/25 bg-sky-500/5 rounded-2xl p-2.5 w-[46%] h-[42%] pointer-events-none">
              <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider font-artistic italic text-sm">
                Setor B: Chopp & Bebidas
              </span>
            </div>

            <div className="absolute bottom-3 left-3 border border-purple-400/25 bg-purple-500/5 rounded-2xl p-2.5 w-[46%] h-[42%] pointer-events-none">
              <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider font-artistic italic text-sm">
                Setor C: Artesanato & Design
              </span>
            </div>

            <div className="absolute bottom-3 right-3 border border-emerald-400/25 bg-emerald-500/5 rounded-2xl p-2.5 w-[46%] h-[42%] pointer-events-none">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider font-artistic italic text-sm">
                Setor D / E: Kids & Telas
              </span>
            </div>

            {/* Central Palco das Estrelas Landmark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-20 rounded-2xl bg-gradient-to-br from-amber-400/15 to-sky-600/15 border border-amber-300/40 flex flex-col items-center justify-center p-2 text-center pointer-events-none shadow-[0_0_20px_rgba(245,183,49,0.2)]">
              <Radio className="w-4 h-4 text-amber-300 mb-0.5" />
              <span className="text-[10px] font-bold text-amber-300">PALCO LUA</span>
              <span className="text-[8px] text-sky-200">DJ Acústico & Violão</span>
            </div>

            {/* Stall Lantern Nodes */}
            {filteredFeirantes.map((feirante) => {
              const nightStatus = getFeiranteNightStatus(feirante.id);
              const isSelected = selectedFeirante?.id === feirante.id;

              return (
                <button
                  key={feirante.id}
                  onClick={() => setSelectedFeirante(feirante)}
                  style={{
                    left: `${feirante.mapPosition?.x ?? 50}%`,
                    top: `${feirante.mapPosition?.y ?? 50}%`
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all cursor-pointer group z-20 ${
                    isSelected
                      ? 'scale-125 z-30 ring-2 ring-amber-300 bg-amber-400/30 shadow-[0_0_18px_rgba(245,183,49,0.7)]'
                      : 'hover:scale-110'
                  }`}
                  title={`${feirante.name} (${feirante.stallNumber})`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold border shadow-md ${nightStatus.badge}`}>
                      {feirante.stallNumber}
                    </div>
                    <span className="text-[9px] font-medium text-amber-200 bg-[#070D1E]/95 px-1.5 py-0.5 rounded border border-amber-400/30 mt-0.5 shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {feirante.name.split(' ')[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Map Footer Legend */}
          <div className="relative z-10 flex items-center justify-between text-xs text-sky-200/80 pt-3 border-t border-amber-400/15 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#F5B731]"></span> Regularizado
              </span>
              <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_#F43F5E]"></span> Pendente de Pagamento
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span> Ausente
              </span>
            </div>
            <div className="text-[11px] text-amber-300/80 font-artistic italic text-sm">
              Clique nas barracas para inspecionar
            </div>
          </div>
        </div>

        {/* Selected Stall Inspector Card (1 col on lg) */}
        {selectedFeirante ? (
          <div className="bg-[#0E1A38]/90 border border-amber-400/25 rounded-3xl p-6 shadow-2xl backdrop-blur-md flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold text-xs border border-amber-400/30">
                  Ponto {selectedFeirante.stallNumber}
                </span>
                <span className="text-xs text-sky-200/80 font-medium font-artistic italic text-sm">
                  {selectedFeirante.sector}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="text-lg font-bold text-white leading-tight">
                  {selectedFeirante.name}
                </h3>
                <span className="text-xs text-slate-300 block mt-0.5">
                  Responsável: {selectedFeirante.legalName || 'Feirante Credenciado'}
                </span>
              </div>

              <div className="mt-4 p-3.5 rounded-xl bg-[#070D1E]/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Situação na Noite:</span>
                  {getFeiranteNightStatus(selectedFeirante.id).status === 'pendente' ? (
                    <span className="font-semibold text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Pendente de Cobrança
                    </span>
                  ) : (
                    <span className="font-semibold text-amber-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Regularizado
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Taxa Fixa Diária:</span>
                  <span className="font-mono font-bold text-amber-300">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedFeirante.defaultFee)}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Demanda de Energia:</span>
                  </span>
                  <span className="font-mono font-semibold text-white">
                    {selectedFeirante.powerDemand}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Alvará Sanitário:</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Válido / Aprovado
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Chave Pix:</span>
                  <span className="font-mono text-amber-200 text-[11px] truncate max-w-[150px]">
                    {selectedFeirante.pixKey || 'Não cadastrada'}
                  </span>
                </div>

                {selectedFeirante.notes && (
                  <div className="pt-2 text-[11px] text-sky-200/70 italic">
                    "{selectedFeirante.notes}"
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              {selectedFeirante.phone ? (
                <a
                  href={`https://wa.me/55${selectedFeirante.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${selectedFeirante.name}! Entramos em contato da Coordenação da Feira da Lua a respeito do ponto ${selectedFeirante.stallNumber}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,183,49,0.25)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp ({selectedFeirante.phone})</span>
                </a>
              ) : (
                <div className="text-center text-xs text-slate-500 italic py-1">
                  Telefone não cadastrado
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="bg-[#0E1A38]/90 border border-slate-800 rounded-3xl p-6 flex items-center justify-center text-center text-slate-400 text-xs shadow-xl">
            Selecione uma barraca no mapa para inspecionar.
          </div>
        )}

      </div>
    </div>
  );
};
