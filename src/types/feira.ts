export type PaymentMethod = 'pix' | 'dinheiro' | 'cartao' | 'pagou_lincon' | 'isento' | 'pendente';

export type AttendanceStatus = 'presente' | 'falta' | 'atestado' | 'cancelado';

export type FairSector = 
  | 'Setor A - Gastronomia'
  | 'Setor B - Chopp & Bebidas'
  | 'Setor C - Artesanato & Design'
  | 'Setor D - Espaço Kids'
  | 'Setor E - Boulevard & Arte';

export interface EntryRecord {
  feiranteId: string;
  status: AttendanceStatus;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  value: number;
  paidTo?: string; // e.g. "Lincon", "Tesouraria", "Caixa Central"
  notes?: string;
  checkInTime?: string;
  receiptNumber?: string;
}

export interface ExpenseItem {
  id: string;
  description: string;
  category: 'som' | 'limpeza' | 'fiscal' | 'luz' | 'banheiro' | 'seguranca' | 'outros';
  amount: number;
  paid?: boolean;
  recipient?: string;
}

export interface FairChecklistItem {
  id: string;
  title: string;
  category: 'eletrica' | 'sanitaria' | 'seguranca' | 'organizacao';
  done: boolean;
  responsible: string;
}

export interface FeiraEdition {
  id: string;
  date: string;
  displayDate: string; // "15/10/2026"
  shortDate: string; // "15/10"
  status: 'realizada' | 'cancelada' | 'em_andamento' | 'agendada';
  weather?: {
    temp: string;
    condition: 'limpo' | 'parcialmente_nublado' | 'chuva' | 'vento';
    rainProb: string;
    description: string;
  };
  systemOk?: boolean;
  estimatedVisitors?: number;
  entries: Record<string, EntryRecord>;
  expenses: ExpenseItem[];
  checklist?: FairChecklistItem[];
  notes?: string;
}

export interface Feirante {
  id: string;
  name: string; // Trade name (e.g. Cachorro Quente do Zé)
  legalName?: string; // Razão social ou nome do responsável
  category: string; // 'Gastronomia', 'Bebidas', 'Artesanato', etc.
  sector: FairSector;
  phone: string;
  pixKey?: string;
  stallNumber: string; // "A-01", "B-03"
  mapPosition: { x: number; y: number }; // Percentage 0-100 on the plaza map
  defaultFee: number;
  powerDemand: '110V' | '220V' | 'Bivolt' | 'Isento de Energia';
  healthPermitValid: boolean;
  status: 'ativo' | 'inativo' | 'em_analise';
  notes?: string;
}

export interface PendingDebtItem {
  id: string;
  feiraId: string;
  feiraDate: string;
  feiranteId: string;
  feiranteName: string;
  sector: FairSector;
  stallNumber: string;
  phone: string;
  presence: AttendanceStatus;
  pendingValue: number;
  paymentMethod: PaymentMethod;
  daysOverdue: number;
  notes?: string;
}
