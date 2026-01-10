import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { UserRole } from '@common/enums';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  nome: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.OPERATOR,
  })
  perfil: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ name: 'desativado_em', type: 'timestamp', nullable: true })
  deactivatedAt?: Date;

  @Column({ name: 'desativado_por', type: 'uuid', nullable: true })
  deactivatedBy?: string;
}
