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

  @OneToMany('Resposta', 'interessado')
  respostas: any[];

  @OneToMany('Followup', 'interessado')
  followups: any[];
}
