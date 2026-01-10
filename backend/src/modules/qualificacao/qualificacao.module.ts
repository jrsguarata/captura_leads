import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QualificacaoService } from './qualificacao.service';
import { QualificacaoController } from './qualificacao.controller';
import { Qualificacao } from './entities/qualificacao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Qualificacao])],
  controllers: [QualificacaoController],
  providers: [QualificacaoService],
  exports: [QualificacaoService],
})
export class QualificacaoModule {}
