import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteressadosService } from './interessados.service';
import { InteressadosController } from './interessados.controller';
import { Interessado } from './entities/interessado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interessado])],
  controllers: [InteressadosController],
  providers: [InteressadosService],
  exports: [InteressadosService],
})
export class InteressadosModule {}
