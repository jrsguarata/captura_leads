import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Interessado } from '@modules/interessados/entities/interessado.entity';
import { FollowupCanal } from '@common/enums';

@Entity('followup')
export class Followup extends BaseEntity {
  @ManyToOne(() => Interessado, (interessado) => interessado.followups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'interessado_id' })
  interessado: Interessado;

  @Column({ name: 'interessado_id', type: 'uuid' })
  interessadoId: string;

  @Column({ type: 'text' })
  texto: string;

  @Column({
    type: 'enum',
    enum: FollowupCanal,
  })
  canal: FollowupCanal;
}
