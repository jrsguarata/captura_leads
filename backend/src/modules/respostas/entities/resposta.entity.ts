import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Interessado } from '@modules/interessados/entities/interessado.entity';

@Entity('respostas')
export class Resposta extends BaseEntity {
  @ManyToOne(() => Interessado, (interessado) => interessado.respostas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'interessado_id' })
  interessado: Interessado;

  @Column({ name: 'interessado_id', type: 'uuid' })
  interessadoId: string;

  @Column({ type: 'text' })
  pergunta: string;

  @Column({ type: 'text' })
  resposta: string;

  @Column({ default: true })
  isActive: boolean;
}
