import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { FeiraEdition, Feirante, EntryRecord, ExpenseItem, PaymentMethod, PendingDebtItem, FairChecklistItem } from '../types/feira';
import { INITIAL_FEIRANTES, INITIAL_FEIRAS } from '../data/initialData';

export type TabKey = 'dashboard' | 'mapa' | 'edicoes' | 'cobrancas' | 'feirantes' | 'prestacao';

interface SummaryMetrics {
  totalFeirasRealizadas: number;
  totalVisitantesEstimados: number;
  totalReceitaBruta: number;
  totalDespesasOperacionais: number;
  saldoLiquidoGeral: number;
  totalPixArrecadado: number;
  totalDinheiroArrecadado: number;
  taxaAdimplencia: number; // Percentage
  totalPendenteAtual: number;
  barracasAtivasTotal: number;
}

interface FeiraContextType {
  feirantes: Feirante[];
  feiras: FeiraEdition[];
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  selectedFeiraId: string;
  setSelectedFeiraId: (id: string) => void;
  selectedFeiranteModal: Feirante | null;
  setSelectedFeiranteModal: (f: Feirante | null) => void;
  pendingDebts: PendingDebtItem[];
  metrics: SummaryMetrics;
  
  // Actions
  addFeirante: (feirante: Omit<Feirante, 'id'>) => void;
  updateFeirante: (id: string, updates: Partial<Feirante>) => void;
  deleteFeirante: (id: string) => void;
  addFeira: (feira: Omit<FeiraEdition, 'id'>) => void;
  updateFeira: (id: string, updates: Partial<FeiraEdition>) => void;
  updateEntry: (feiraId: string, feiranteId: string, updates: Partial<EntryRecord>) => void;
  addExpense: (feiraId: string, expense: Omit<ExpenseItem, 'id'>) => void;
  removeExpense: (feiraId: string, expenseId: string) => void;
  toggleChecklistItem: (feiraId: string, itemId: string) => void;
  settleDebt: (feiraId: string, feiranteId: string, method: PaymentMethod, value?: number) => void;
  resetToOriginalData: () => void;
}

const STORAGE_KEY_FEIRANTES = 'lunaris_feirantes_v3';
const STORAGE_KEY_FEIRAS = 'lunaris_feiras_v3';

const FeiraContext = createContext<FeiraContextType | undefined>(undefined);

export const FeiraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feirantes, setFeirantes] = useState<Feirante[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FEIRANTES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_FEIRANTES;
  });

  const [feiras, setFeiras] = useState<FeiraEdition[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FEIRAS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_FEIRAS;
  });

  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [selectedFeiraId, setSelectedFeiraId] = useState<string>(INITIAL_FEIRAS[0]?.id || '');
  const [selectedFeiranteModal, setSelectedFeiranteModal] = useState<Feirante | null>(null);

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FEIRANTES, JSON.stringify(feirantes));
    } catch {
      // ignore
    }
  }, [feirantes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FEIRAS, JSON.stringify(feiras));
    } catch {
      // ignore
    }
  }, [feiras]);

  // Compute pending debts with days overdue calculation
  const pendingDebts = useMemo<PendingDebtItem[]>(() => {
    const list: PendingDebtItem[] = [];
    const feiranteMap = new Map(feirantes.map(f => [f.id, f]));
    const now = new Date();

    feiras.forEach(feira => {
      if (feira.status === 'cancelada') return;

      const feiraDateObj = new Date(feira.date);
      const diffTime = Math.max(0, now.getTime() - feiraDateObj.getTime());
      const daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      Object.entries(feira.entries).forEach(([feiranteId, entry]) => {
        if (!entry.isPaid && entry.value > 0 && entry.paymentMethod === 'pendente') {
          const feirante = feiranteMap.get(feiranteId);
          list.push({
            id: `${feira.id}_${feiranteId}`,
            feiraId: feira.id,
            feiraDate: feira.displayDate,
            feiranteId,
            feiranteName: feirante?.name || 'Barraca Não Identificada',
            sector: feirante?.sector || 'Setor A - Gastronomia',
            stallNumber: feirante?.stallNumber || '-',
            phone: feirante?.phone || '',
            presence: entry.status,
            pendingValue: entry.value,
            paymentMethod: entry.paymentMethod,
            daysOverdue,
            notes: entry.notes
          });
        }
      });
    });

    return list;
  }, [feiras, feirantes]);

  // Comprehensive metrics
  const metrics = useMemo<SummaryMetrics>(() => {
    let totalFeirasRealizadas = 0;
    let totalVisitantesEstimados = 0;
    let totalReceitaBruta = 0;
    let totalDespesasOperacionais = 0;
    let totalPixArrecadado = 0;
    let totalDinheiroArrecadado = 0;
    let totalPendenteAtual = 0;
    let totalCobrancasEsperadas = 0;
    let totalCobrancasPagas = 0;

    feiras.forEach(feira => {
      if (feira.status === 'realizada') {
        totalFeirasRealizadas++;
        totalVisitantesEstimados += feira.estimatedVisitors || 2500;
      }

      // Sum expenses
      const expSum = feira.expenses.reduce((sum, item) => sum + item.amount, 0);
      totalDespesasOperacionais += expSum;

      // Sum revenues
      Object.values(feira.entries).forEach(entry => {
        if (entry.status === 'presente') {
          totalCobrancasEsperadas++;
          if (entry.isPaid) {
            totalCobrancasPagas++;
            totalReceitaBruta += entry.value;
            if (entry.paymentMethod === 'pix' || entry.paymentMethod === 'pagou_lincon') {
              totalPixArrecadado += entry.value;
            } else if (entry.paymentMethod === 'dinheiro') {
              totalDinheiroArrecadado += entry.value;
            }
          } else if (entry.paymentMethod === 'pendente') {
            totalPendenteAtual += entry.value;
          }
        }
      });
    });

    const saldoLiquidoGeral = totalReceitaBruta - totalDespesasOperacionais;
    const taxaAdimplencia = totalCobrancasEsperadas > 0
      ? Math.round((totalCobrancasPagas / totalCobrancasEsperadas) * 100)
      : 100;

    return {
      totalFeirasRealizadas,
      totalVisitantesEstimados,
      totalReceitaBruta,
      totalDespesasOperacionais,
      saldoLiquidoGeral,
      totalPixArrecadado,
      totalDinheiroArrecadado,
      taxaAdimplencia,
      totalPendenteAtual,
      barracasAtivasTotal: feirantes.filter(f => f.status === 'ativo').length
    };
  }, [feiras, feirantes]);

  const addFeirante = (feiranteData: Omit<Feirante, 'id'>) => {
    const newId = `f-${Date.now()}`;
    const newFeirante: Feirante = { ...feiranteData, id: newId };
    setFeirantes(prev => [...prev, newFeirante]);
  };

  const updateFeirante = (id: string, updates: Partial<Feirante>) => {
    setFeirantes(prev => prev.map(f => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteFeirante = (id: string) => {
    setFeirantes(prev => prev.filter(f => f.id !== id));
  };

  const addFeira = (feiraData: Omit<FeiraEdition, 'id'>) => {
    const newId = `feira-${Date.now()}`;
    const newFeira: FeiraEdition = { ...feiraData, id: newId };
    setFeiras(prev => [newFeira, ...prev]);
    setSelectedFeiraId(newId);
  };

  const updateFeira = (id: string, updates: Partial<FeiraEdition>) => {
    setFeiras(prev => prev.map(f => (f.id === id ? { ...f, ...updates } : f)));
  };

  const updateEntry = (feiraId: string, feiranteId: string, updates: Partial<EntryRecord>) => {
    setFeiras(prev =>
      prev.map(feira => {
        if (feira.id !== feiraId) return feira;

        const currentEntry = feira.entries[feiranteId] || {
          feiranteId,
          status: 'presente',
          paymentMethod: 'pix',
          isPaid: true,
          value: 55.0
        };

        return {
          ...feira,
          entries: {
            ...feira.entries,
            [feiranteId]: { ...currentEntry, ...updates }
          }
        };
      })
    );
  };

  const addExpense = (feiraId: string, expense: Omit<ExpenseItem, 'id'>) => {
    const newExpId = `exp-${Date.now()}`;
    setFeiras(prev =>
      prev.map(feira => {
        if (feira.id !== feiraId) return feira;
        return {
          ...feira,
          expenses: [...feira.expenses, { ...expense, id: newExpId }]
        };
      })
    );
  };

  const removeExpense = (feiraId: string, expenseId: string) => {
    setFeiras(prev =>
      prev.map(feira => {
        if (feira.id !== feiraId) return feira;
        return {
          ...feira,
          expenses: feira.expenses.filter(e => e.id !== expenseId)
        };
      })
    );
  };

  const toggleChecklistItem = (feiraId: string, itemId: string) => {
    setFeiras(prev =>
      prev.map(feira => {
        if (feira.id !== feiraId || !feira.checklist) return feira;
        return {
          ...feira,
          checklist: feira.checklist.map(chk =>
            chk.id === itemId ? { ...chk, done: !chk.done } : chk
          )
        };
      })
    );
  };

  const settleDebt = (feiraId: string, feiranteId: string, method: PaymentMethod, value?: number) => {
    updateEntry(feiraId, feiranteId, {
      paymentMethod: method,
      isPaid: true,
      notes: `Quitação via ${method.toUpperCase()} em ${new Date().toLocaleDateString('pt-BR')}`,
      receiptNumber: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      ...(value !== undefined ? { value } : {})
    });
  };

  const resetToOriginalData = () => {
    if (window.confirm('Deseja restaurar as configurações e dados base da Feira da Lua?')) {
      setFeirantes(INITIAL_FEIRANTES);
      setFeiras(INITIAL_FEIRAS);
      setSelectedFeiraId(INITIAL_FEIRAS[0]?.id || '');
      localStorage.removeItem(STORAGE_KEY_FEIRANTES);
      localStorage.removeItem(STORAGE_KEY_FEIRAS);
    }
  };

  return (
    <FeiraContext.Provider
      value={{
        feirantes,
        feiras,
        activeTab,
        setActiveTab,
        selectedFeiraId,
        setSelectedFeiraId,
        selectedFeiranteModal,
        setSelectedFeiranteModal,
        pendingDebts,
        metrics,
        addFeirante,
        updateFeirante,
        deleteFeirante,
        addFeira,
        updateFeira,
        updateEntry,
        addExpense,
        removeExpense,
        toggleChecklistItem,
        settleDebt,
        resetToOriginalData
      }}
    >
      {children}
    </FeiraContext.Provider>
  );
};

export const useFeira = () => {
  const context = useContext(FeiraContext);
  if (!context) {
    throw new Error('useFeira must be used within a FeiraProvider');
  }
  return context;
};
