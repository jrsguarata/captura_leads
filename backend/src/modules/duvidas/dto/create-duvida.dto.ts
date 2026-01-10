import { IsEmail, IsNotEmpty, IsString, Length, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DuvidaStatus } from '@common/enums';

export class CreateDuvidaDto {
  @ApiProperty({ example: 'Carlos Santos' })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome não pode estar vazio' })
  nome: string;

  @ApiProperty({ example: 'carlos@example.com' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email não pode estar vazio' })
  email: string;

  @ApiProperty({ example: '11987654321' })
  @IsString({ message: 'Celular deve ser uma string' })
  @Length(10, 11, { message: 'Celular deve ter 10 ou 11 dígitos' })
  @IsNotEmpty({ message: 'Celular não pode estar vazio' })
  celular: string;

  @ApiProperty({ example: 'Quais são as formas de pagamento aceitas?' })
  @IsString({ message: 'Dúvida deve ser uma string' })
  @IsNotEmpty({ message: 'Dúvida não pode estar vazia' })
  duvida: string;

  @ApiPropertyOptional({ example: 'Aceitamos cartão, PIX e boleto.' })
  @IsOptional()
  @IsString({ message: 'Resposta deve ser uma string' })
  resposta?: string;

  @ApiPropertyOptional({ enum: DuvidaStatus, example: DuvidaStatus.FEITA })
  @IsOptional()
  @IsEnum(DuvidaStatus, { message: 'Status inválido' })
  status?: DuvidaStatus;
}
