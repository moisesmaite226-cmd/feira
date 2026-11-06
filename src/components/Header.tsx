import React from 'react';
import { useFeira, TabKey } from '../context/FeiraContext';
import { 
  Moon, 
  LayoutDashboard, 
  MapPin, 
  Store, 
  MessageSquare, 
  Users, 
  FileText, 
  RefreshCw,
  Sparkles,
  Palette
} from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, resetToOriginalData, pendingDebts } = useFeira();

  const navItems: { key: TabKey; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: 'dashboard', label: 'Visão Geral', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'mapa', label: 'Praça das Estrelas', icon: <MapPin className="w-4 h-4" /> },
    { key: 'edicoes', label: 'Noite de Feira', icon: <Store className="w-4 h-4" /> },
    { 
      key: 'cobrancas', 
      label: 'Cobranças & Pix', 
      icon: <MessageSquare className="w-4 h-4" />,
      badge: pendingDebts.length > 0 ? pendingDebts.length : undefined
    },
    { key: 'feirantes', label: 'Feirantes', icon: <Users className="w-4 h-4" /> },
    { key: 'prestacao', label: 'Prestação de Contas', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-400/20 bg-[#0B142A]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 transition-all print:hidden shadow-lg shadow-black/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand with Van Gogh Crescent Moon & Radiating Star Halo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/30 via-sky-600/20 to-blue-950/60 border border-amber-300/40 shadow-[0_0_20px_rgba(245,183,49,0.3)]">
              {/* Van Gogh halo circles */}
              <div className="absolute inset-0 rounded-2xl border border-amber-400/20 animate-halo pointer-events-none" />
              <Moon className="w-6 h-6 text-amber-300 fill-amber-300/40 -rotate-12 drop-shadow-[0_0_8px_rgba(245,183,49,0.6)]" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  FEIRA DA
                </span>
                <span className="text-2xl font-bold tracking-wide text-amber-300 font-artistic italic drop-shadow-[0_0_12px_rgba(245,183,49,0.5)]">
                  LUA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 hidden sm:inline">
                  Van Gogh
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-sky-200/70 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span className="italic font-artistic text-sm text-amber-200/90">Inspirado na Noite Estrelada</span>
                <span className="text-slate-500">·</span>
                <span className="text-[11px] text-slate-300">Controle de Feiras</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs with Cobalt Swirls & Star-Yellow Active state */}
        <nav className="flex items-center flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 p-1 bg-[#070D1E]/80 rounded-2xl border border-slate-800">
            {navItems.map(item => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`relative flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 font-bold shadow-[0_0_18px_rgba(245,183,49,0.35)]'
                      : 'text-slate-300 hover:text-amber-200 hover:bg-slate-800/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                      isActive ? 'bg-slate-950 text-amber-300' : 'bg-rose-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Reset */}
          <button
            onClick={resetToOriginalData}
            title="Restaurar dados padrão"
            className="flex items-center p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-slate-800/60 transition-colors cursor-pointer border border-slate-800 ml-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </nav>

      </div>
    </header>
  );
};
