import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'criado_por', type: 'uuid', nullable: true })
  criadoPor?: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @Column({ name: 'alterado_por', type: 'uuid', nullable: true })
  alteradoPor?: string;

  @UpdateDateColumn({ name: 'alterado_em' })
  alteradoEm: Date;

  @Column({ name: 'desativado_por', type: 'uuid', nullable: true })
  desativadoPor?: string;

  @DeleteDateColumn({ name: 'desativado_em' })
  desativadoEm?: Date;
}
