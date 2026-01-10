import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Duvida } from './entities/duvida.entity';
import { CreateDuvidaDto } from './dto/create-duvida.dto';
import { UpdateDuvidaDto } from './dto/update-duvida.dto';
import { DuvidaStatus } from '@common/enums';

@Injectable()
export class DuvidasService {
  constructor(
    @InjectRepository(Duvida)
    private duvidasRepository: Repository<Duvida>,
  ) {}

  async create(createDuvidaDto: CreateDuvidaDto, currentUserId?: string): Promise<Duvida> {
    const duvida = this.duvidasRepository.create({
      ...createDuvidaDto,
      status: createDuvidaDto.status || DuvidaStatus.FEITA,
      criadoPor: currentUserId,
    });

    return this.duvidasRepository.save(duvida);
  }

  async findAll(
    offset: number = 0,
    limit: number = 200,
  ): Promise<{ data: Duvida[]; total: number }> {
    const [data, total] = await this.duvidasRepository.findAndCount({
      skip: offset,
      take: Math.min(limit, 200),
      order: { criadoEm: 'DESC' },
      withDeleted: true,
    });

    return { data, total };
  }

  async findOne(id: string): Promise<Duvida> {
    const duvida = await this.duvidasRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!duvida) {
      throw new NotFoundException(`Dúvida com ID ${id} não encontrada`);
    }

    return duvida;
  }

  async update(
    id: string,
    updateDuvidaDto: UpdateDuvidaDto,
    currentUserId: string,
  ): Promise<Duvida> {
    const duvida = await this.findOne(id);

    Object.assign(duvida, updateDuvidaDto);
    duvida.alteradoPor = currentUserId;

    // Se o status mudou para RESPONDIDA, definir isActive como false
    if ((updateDuvidaDto as any).status === DuvidaStatus.RESPONDIDA) {
      duvida.isActive = false;
    }

    return this.duvidasRepository.save(duvida);
  }

  async remove(id: string, currentUserId: string): Promise<void> {
    const duvida = await this.findOne(id);
    duvida.desativadoPor = currentUserId;
    await this.duvidasRepository.save(duvida);
    await this.duvidasRepository.softRemove(duvida);
  }

  async findByStatus(status: DuvidaStatus): Promise<Duvida[]> {
    return this.duvidasRepository.find({
      where: { status },
      order: { criadoEm: 'DESC' },
    });
  }
}
