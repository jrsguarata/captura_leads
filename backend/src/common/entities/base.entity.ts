import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('User', { nullable: true, onDelete: 'SET NULL', lazy: true })
  @JoinColumn({ name: 'criado_por' })
  criadoPorUser?: Promise<any>;

  @RelationId((entity: BaseEntity) => entity.criadoPorUser)
  criadoPor?: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @ManyToOne('User', { nullable: true, onDelete: 'SET NULL', lazy: true })
  @JoinColumn({ name: 'alterado_por' })
  alteradoPorUser?: Promise<any>;

  @RelationId((entity: BaseEntity) => entity.alteradoPorUser)
  alteradoPor?: string;

  @UpdateDateColumn({ name: 'alterado_em' })
  alteradoEm: Date;

  @ManyToOne('User', { nullable: true, onDelete: 'SET NULL', lazy: true })
  @JoinColumn({ name: 'desativado_por' })
  desativadoPorUser?: Promise<any>;

  @RelationId((entity: BaseEntity) => entity.desativadoPorUser)
  desativadoPor?: string;

  @DeleteDateColumn({ name: 'desativado_em' })
  desativadoEm?: Date;
}
