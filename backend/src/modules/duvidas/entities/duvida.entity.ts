import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { DuvidaStatus } from '@common/enums';

@Entity('duvidas')
export class Duvida extends BaseEntity {
  @Column()
  nome: string;

  @Column()
  email: string;

  @Column({ length: 11 })
  celular: string;

  @Column({ type: 'text' })
  duvida: string;

  @Column({ type: 'text', nullable: true })
  resposta?: string;

  @Column({
    type: 'enum',
    enum: DuvidaStatus,
    default: DuvidaStatus.FEITA,
  })
  status: DuvidaStatus;
}
