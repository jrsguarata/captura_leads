import { IsNotEmpty, IsString, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FollowupCanal } from '@common/enums';

export class CreateFollowupDto {
  @ApiProperty({ example: 'uuid-do-interessado' })
  @IsUUID('4', { message: 'ID do interessado inválido' })
  @IsNotEmpty({ message: 'ID do interessado não pode estar vazio' })
  interessadoId: string;

  @ApiProperty({ example: 'Entrei em contato por telefone, cliente interessado mas pediu mais tempo para decidir.' })
  @IsString({ message: 'Texto deve ser uma string' })
  @IsNotEmpty({ message: 'Texto não pode estar vazio' })
  texto: string;

  @ApiProperty({ enum: FollowupCanal, example: FollowupCanal.VOZ })
  @IsEnum(FollowupCanal, { message: 'Canal inválido' })
  canal: FollowupCanal;
}
