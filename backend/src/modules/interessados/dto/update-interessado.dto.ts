import { PartialType } from '@nestjs/swagger';
import { CreateInteressadoDto } from './create-interessado.dto';

export class UpdateInteressadoDto extends PartialType(CreateInteressadoDto) {}
