import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Followup } from './entities/followup.entity';
import { CreateFollowupDto } from './dto/create-followup.dto';
import { UpdateFollowupDto } from './dto/update-followup.dto';
import { UserRole } from '@common/enums';

@Injectable()
export class FollowupService {
  constructor(
    @InjectRepository(Followup)
    private followupRepository: Repository<Followup>,
  ) {}

  async create(createFollowupDto: CreateFollowupDto, currentUserId: string): Promise<Followup> {
    const followup = this.followupRepository.create({
      ...createFollowupDto,
      criadoPor: currentUserId,
    });

    return this.followupRepository.save(followup);
  }

  async findAll(
    offset: number = 0,
    limit: number = 200,
  ): Promise<{ data: Followup[]; total: number }> {
    const [data, total] = await this.followupRepository.findAndCount({
      skip: offset,
      take: Math.min(limit, 200),
      order: { criadoEm: 'DESC' },
      relations: ['interessado'],
    });

    return { data, total };
  }

  async findByInteressado(interessadoId: string): Promise<Followup[]> {
    return this.followupRepository.find({
      where: { interessadoId },
      order: { criadoEm: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Followup> {
    const followup = await this.followupRepository.findOne({
      where: { id },
      relations: ['interessado'],
    });

    if (!followup) {
      throw new NotFoundException(`Follow-up com ID ${id} não encontrado`);
    }

    return followup;
  }

  async update(
    id: string,
    updateFollowupDto: UpdateFollowupDto,
    currentUserId: string,
    userRole: UserRole,
  ): Promise<Followup> {
    const followup = await this.findOne(id);

    // OPERATOR só pode editar follow-ups criados por ele
    if (userRole === UserRole.OPERATOR && followup.criadoPor !== currentUserId) {
      throw new ForbiddenException('Você só pode editar follow-ups criados por você');
    }

    Object.assign(followup, updateFollowupDto);
    followup.alteradoPor = currentUserId;

    return this.followupRepository.save(followup);
  }

  async remove(id: string, currentUserId: string): Promise<void> {
    const followup = await this.findOne(id);
    followup.desativadoPor = currentUserId;
    await this.followupRepository.save(followup);
    await this.followupRepository.softRemove(followup);
  }
}
