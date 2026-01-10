import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RespostasService } from './respostas.service';
import { RespostasController } from './respostas.controller';
import { Resposta } from './entities/resposta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resposta])],
  controllers: [RespostasController],
  providers: [RespostasService],
  exports: [RespostasService],
})
export class RespostasModule {}
