import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { InteressadoStatus } from '@common/enums';

@Entity('interessados')
export class Interessado extends BaseEntity {
  @Column()
  nome: string;

  @Column()
  email: string;

  @Column({ length: 11 })
  celular: string;

  @Column({
    type: 'enum',
    enum: InteressadoStatus,
    default: InteressadoStatus.LEAD,
  })
  status: InteressadoStatus;

  @Column({ default: true })
  isActive: boolean;

  // === Dados Pessoais ===
  @Column({ length: 11, nullable: true })
  cpf?: string;

  @Column({ length: 8, nullable: true })
  cep?: string;

  @Column({ nullable: true })
  logradouro?: string;

  @Column({ nullable: true })
  bairro?: string;

  @Column({ nullable: true })
  cidade?: string;

  @Column({ length: 2, nullable: true })
  estado?: string;

  @Column({ nullable: true })
  numero?: string;

  @Column({ nullable: true })
  complemento?: string;

  // === Dados Profissionais ===
  @Column({ nullable: true })
  profissao?: string;

  @Column({ name: 'registro_conselho', nullable: true })
  registroConselho?: string;

  @Column({ name: 'tempo_experiencia', nullable: true })
  tempoExperiencia?: string;

  @Column({ name: 'cep_profissional', length: 8, nullable: true })
  cepProfissional?: string;

  @Column({ name: 'logradouro_profissional', nullable: true })
  logradouroProfissional?: string;

  @Column({ name: 'bairro_profissional', nullable: true })
  bairroProfissional?: string;

  @Column({ name: 'cidade_profissional', nullable: true })
  cidadeProfissional?: string;

  @Column({ name: 'estado_profissional', length: 2, nullable: true })
  estadoProfissional?: string;

  @Column({ name: 'numero_profissional', nullable: true })
  numeroProfissional?: string;

  @Column({ name: 'complemento_profissional', nullable: true })
  complementoProfissional?: string;

  @OneToMany('Resposta', 'interessado')
  respostas: any[];

  @OneToMany('Followup', 'interessado')
  followups: any[];
}
