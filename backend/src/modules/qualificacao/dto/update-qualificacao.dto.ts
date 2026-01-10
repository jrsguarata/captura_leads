import { PartialType } from '@nestjs/swagger';
import { CreateQualificacaoDto } from './create-qualificacao.dto';

export class UpdateQualificacaoDto extends PartialType(CreateQualificacaoDto) {}
