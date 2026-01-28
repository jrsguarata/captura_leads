export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
}

export enum InteressadoStatus {
  LEAD = 'lead',
  PROSPECT = 'prospect',
  NEGOTIATION = 'negotiation',
  WIN = 'win',
  LOST = 'lost',
  INTERRUPTED = 'interrupted',
}

export enum DuvidaStatus {
  FEITA = 'feita',
  RESPONDIDA = 'respondida',
  PROSPECT = 'prospect',
  NEGOTIATION = 'negotiation',
  WIN = 'win',
  LOST = 'lost',
  INTERRUPTED = 'interrupted',
}

export enum FollowupCanal {
  VOZ = 'voz',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
}

export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: UserRole;
  isActive: boolean;
  criadoPor?: string;
  criadoEm: string;
  alteradoPor?: string;
  alteradoEm: string;
  desativadoPor?: string;
  desativadoEm?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Interessado {
  id: string;
  nome: string;
  email: string;
  celular: string;
  status: InteressadoStatus;
  isActive: boolean;
  criadoEm: string;
  alteradoEm: string;
  criadoPor?: string;
  alteradoPor?: string;
  desativadoPor?: string;
  desativadoEm?: string;
}

export interface CreateInteressadoDto {
  nome: string;
  email: string;
  celular: string;
}

export interface Qualificacao {
  id: string;
  questao: string;
  obrigatoriedade: boolean;
  opcoes?: string;
  isActive: boolean;
  criadoEm: string;
}

export interface Resposta {
  id: string;
  interessadoId: string;
  pergunta: string;
  resposta: string;
  criadoEm: string;
}

export interface CreateRespostaDto {
  interessadoId: string;
  pergunta: string;
  resposta: string;
}

export interface CreateRespostasBatchDto {
  interessadoId: string;
  respostas: Array<{
    pergunta: string;
    resposta: string;
  }>;
}

export interface Duvida {
  id: string;
  nome: string;
  email: string;
  celular: string;
  duvida: string;
  resposta?: string;
  status: DuvidaStatus;
  criadoEm: string;
  alteradoEm: string;
  desativadoEm?: string;
}

export interface CreateDuvidaDto {
  nome: string;
  email: string;
  celular: string;
  duvida: string;
}

export interface Followup {
  id: string;
  interessadoId: string;
  texto: string;
  canal: FollowupCanal;
  criadoEm: string;
  criadoPor?: string;
}

export interface CreateFollowupDto {
  interessadoId: string;
  texto: string;
  canal: FollowupCanal;
}
