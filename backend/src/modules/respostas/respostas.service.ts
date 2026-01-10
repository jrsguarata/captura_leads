import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resposta } from './entities/resposta.entity';
import { CreateRespostaDto } from './dto/create-resposta.dto';
import { CreateRespostasBatchDto } from './dto/create-respostas-batch.dto';

@Injectable()
export class RespostasService {
  constructor(
    @InjectRepository(Resposta)
    private respostasRepository: Repository<Resposta>,
  ) {}

  async create(createRespostaDto: CreateRespostaDto, currentUserId?: string): Promise<Resposta> {
    const resposta = this.respostasRepository.create({
      ...createRespostaDto,
      criadoPor: currentUserId,
    });

    return this.respostasRepository.save(resposta);
  }

  async createBatch(
    batchDto: CreateRespostasBatchDto,
    currentUserId?: string,
  ): Promise<Resposta[]> {
    const respostasEntities = batchDto.respostas.map((item) =>
      this.respostasRepository.create({
        interessadoId: batchDto.interessadoId,
        pergunta: item.pergunta,
        resposta: item.resposta,
        criadoPor: currentUserId,
      }),
    );

    return this.respostasRepository.save(respostasEntities);
  }

  async findAll(
    offset: number = 0,
    limit: number = 200,
  ): Promise<{ data: Resposta[]; total: number }> {
    const [data, total] = await this.respostasRepository.findAndCount({
      skip: offset,
      take: Math.min(limit, 200),
      order: { criadoEm: 'DESC' },
      relations: ['interessado'],
    });

    return { data, total };
  }

  async findByInteressado(interessadoId: string): Promise<Resposta[]> {
    return this.respostasRepository.find({
      where: { interessadoId },
      order: { criadoEm: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Resposta> {
    const resposta = await this.respostasRepository.findOne({
      where: { id },
      relations: ['interessado'],
    });

    if (!resposta) {
      throw new NotFoundException(`Resposta com ID ${id} não encontrada`);
    }

    return resposta;
  }

  async remove(id: string, currentUserId: string): Promise<void> {
    const resposta = await this.findOne(id);
    resposta.desativadoPor = currentUserId;
    await this.respostasRepository.save(resposta);
    await this.respostasRepository.softRemove(resposta);
  }
}
