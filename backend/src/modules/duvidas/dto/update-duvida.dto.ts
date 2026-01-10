import { PartialType } from '@nestjs/swagger';
import { CreateDuvidaDto } from './create-duvida.dto';

export class UpdateDuvidaDto extends PartialType(CreateDuvidaDto) {}
