import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interessado } from './entities/interessado.entity';
import { CreateInteressadoDto } from './dto/create-interessado.dto';
import { UpdateInteressadoDto } from './dto/update-interessado.dto';
import { InteressadoStatus } from '@common/enums';

@Injectable()
export class InteressadosService {
  constructor(
    @InjectRepository(Interessado)
    private interessadosRepository: Repository<Interessado>,
  ) {}

  async create(
    createInteressadoDto: CreateInteressadoDto,
    currentUserId?: string,
  ): Promise<Interessado> {
    const interessado = this.interessadosRepository.create({
      ...createInteressadoDto,
      status: createInteressadoDto.status || InteressadoStatus.LEAD,
      criadoPor: currentUserId,
    });

    return this.interessadosRepository.save(interessado);
  }

  async findAll(
    offset: number = 0,
    limit: number = 200,
  ): Promise<{ data: Interessado[]; total: number }> {
    const [data, total] = await this.interessadosRepository.findAndCount({
      skip: offset,
      take: Math.min(limit, 200),
      order: { criadoEm: 'DESC' },
      relations: ['respostas', 'followups'],
      withDeleted: true,
    });

    return { data, total };
  }

  async findOne(id: string): Promise<Interessado> {
    const interessado = await this.interessadosRepository.findOne({
      where: { id },
      relations: ['respostas', 'followups'],
    });

    if (!interessado) {
      throw new NotFoundException(`Interessado com ID ${id} não encontrado`);
    }

    return interessado;
  }

  async update(
    id: string,
    updateInteressadoDto: UpdateInteressadoDto,
    currentUserId: string,
  ): Promise<Interessado> {
    const interessado = await this.findOne(id);

    Object.assign(interessado, updateInteressadoDto);
    interessado.alteradoPor = currentUserId;

    return this.interessadosRepository.save(interessado);
  }

  async remove(id: string, currentUserId: string): Promise<void> {
    const interessado = await this.findOne(id);
    interessado.desativadoPor = currentUserId;
    await this.interessadosRepository.save(interessado);
    await this.interessadosRepository.softRemove(interessado);
  }

  async findByStatus(status: InteressadoStatus): Promise<Interessado[]> {
    return this.interessadosRepository.find({
      where: { status },
      order: { criadoEm: 'DESC' },
    });
  }
}
