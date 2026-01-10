import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DuvidasService } from './duvidas.service';
import { DuvidasController } from './duvidas.controller';
import { Duvida } from './entities/duvida.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Duvida])],
  controllers: [DuvidasController],
  providers: [DuvidasService],
  exports: [DuvidasService],
})
export class DuvidasModule {}
