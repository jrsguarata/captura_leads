import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('qualificacao')
export class Qualificacao extends BaseEntity {
  @Column({ type: 'text' })
  questao: string;

  @Column({ default: false })
  obrigatoriedade: boolean;

  @Column({ type: 'text', nullable: true })
  opcoes?: string;
}
