/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FeiraProvider, useFeira } from './context/FeiraContext';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { MapaPracaView } from './components/MapaPracaView';
import { FeirasView } from './components/FeirasView';
import { CobrancasView } from './components/CobrancasView';
import { FeirantesView } from './components/FeirantesView';
import { PrestacaoContasView } from './components/PrestacaoContasView';
import starryNightBg from './assets/images/starry_night_market_1793716707624.jpg';
import { Moon, Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab } = useFeira();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'mapa' && <MapaPracaView />}
      {activeTab === 'edicoes' && <FeirasView />}
      {activeTab === 'cobrancas' && <CobrancasView />}
      {activeTab === 'feirantes' && <FeirantesView />}
      {activeTab === 'prestacao' && <PrestacaoContasView />}
    </main>
  );
};

export default function App() {
  return (
    <FeiraProvider>
      <div className="min-h-screen bg-[#0A1226] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-amber-400 selection:text-slate-950 font-['Plus_Jakarta_Sans']">
        
        {/* Van Gogh Starry Night Artistic Backdrop Overlay */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Subtle Impressionist Painted Background Texture */}
          <div 
            className="absolute -top-10 inset-x-0 h-[520px] opacity-25 mix-blend-screen bg-cover bg-center filter blur-[1px] transition-opacity"
            style={{ backgroundImage: `url(${starryNightBg})` }}
          />

          {/* Van Gogh Radiating Swirl Circles */}
          <div className="absolute top-[8%] left-[25%] w-[450px] h-[450px] rounded-full bg-radial from-amber-400/10 via-sky-600/10 to-transparent blur-3xl animate-halo" />
          <div className="absolute top-[35%] right-[5%] w-[500px] h-[500px] rounded-full bg-radial from-sky-400/10 via-blue-900/15 to-transparent blur-3xl" />
          <div className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-radial from-blue-900/20 via-slate-950 to-transparent blur-3xl" />
          
          {/* Subtle celestial golden star nodes */}
          <div className="absolute top-16 left-[22%] w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_12px_#F5B731]" />
          <div className="absolute top-28 right-[18%] w-2.5 h-2.5 rounded-full bg-yellow-200 shadow-[0_0_15px_#F5B731]" />
          <div className="absolute top-[45%] left-10 w-1.5 h-1.5 rounded-full bg-amber-400/80 shadow-[0_0_10px_#F5B731]" />
          <div className="absolute top-[70%] right-[30%] w-2 h-2 rounded-full bg-sky-200/90 shadow-[0_0_10px_#4D93C4]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex-1 flex flex-col">
          <Header />
          <div className="flex-1">
            <MainContent />
          </div>

          {/* Artistic Footer */}
          <footer className="mt-auto border-t border-amber-400/15 bg-[#070D1E]/95 py-6 px-4 text-xs text-slate-400 print:hidden backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-amber-300 fill-amber-300/30" />
                <span className="font-bold text-white tracking-wide">FEIRA DA LUA</span>
                <span className="text-amber-300 font-artistic italic text-sm">· Vincent van Gogh</span>
              </div>
              <div className="text-slate-400 text-[11px] font-artistic italic text-sm">
                "Não tenho certeza de nada, mas a visão das estrelas me faz sonhar." — Vincent van Gogh
              </div>
            </div>
          </footer>
        </div>

      </div>
    </FeiraProvider>
  );
}
