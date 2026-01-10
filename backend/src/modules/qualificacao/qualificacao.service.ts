import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Qualificacao } from './entities/qualificacao.entity';
import { CreateQualificacaoDto } from './dto/create-qualificacao.dto';
import { UpdateQualificacaoDto } from './dto/update-qualificacao.dto';

@Injectable()
export class QualificacaoService {
  constructor(
    @InjectRepository(Qualificacao)
    private qualificacaoRepository: Repository<Qualificacao>,
  ) {}

  async create(
    createQualificacaoDto: CreateQualificacaoDto,
    currentUserId: string,
  ): Promise<Qualificacao> {
    const qualificacao = this.qualificacaoRepository.create({
      ...createQualificacaoDto,
      criadoPor: currentUserId,
    });

    return this.qualificacaoRepository.save(qualificacao);
  }

  async findAll(
    offset: number = 0,
    limit: number = 200,
  ): Promise<{ data: Qualificacao[]; total: number }> {
    const [data, total] = await this.qualificacaoRepository.findAndCount({
      skip: offset,
      take: Math.min(limit, 200),
      order: { criadoEm: 'DESC' },
      withDeleted: true,
    });

    return { data, total };
  }

  async findAllActive(): Promise<Qualificacao[]> {
    // Retorna apenas perguntas ativas (não soft deleted) para a landing page
    return this.qualificacaoRepository.find({
      where: { desativadoEm: IsNull() },
      order: { criadoEm: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Qualificacao> {
    const qualificacao = await this.qualificacaoRepository.findOne({
      where: { id },
    });

    if (!qualificacao) {
      throw new NotFoundException(`Pergunta com ID ${id} não encontrada`);
    }

    return qualificacao;
  }

  async update(
    id: string,
    updateQualificacaoDto: UpdateQualificacaoDto,
    currentUserId: string,
  ): Promise<Qualificacao> {
    const qualificacao = await this.findOne(id);

    Object.assign(qualificacao, updateQualificacaoDto);
    qualificacao.alteradoPor = currentUserId;

    return this.qualificacaoRepository.save(qualificacao);
  }

  async remove(id: string, currentUserId: string): Promise<void> {
    const qualificacao = await this.findOne(id);
    qualificacao.desativadoPor = currentUserId;
    await this.qualificacaoRepository.save(qualificacao);
    await this.qualificacaoRepository.softRemove(qualificacao);
  }
}
