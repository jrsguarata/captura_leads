import { IsEmail, IsNotEmpty, IsString, Length, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InteressadoStatus } from '@common/enums';

export class CreateInteressadoDto {
  @ApiProperty({ example: 'Maria Silva' })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome não pode estar vazio' })
  nome: string;

  @ApiProperty({ example: 'maria@example.com' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email não pode estar vazio' })
  email: string;

  @ApiProperty({ example: '11987654321', description: 'Celular com 10 ou 11 dígitos' })
  @IsString({ message: 'Celular deve ser uma string' })
  @Length(10, 11, { message: 'Celular deve ter 10 ou 11 dígitos' })
  @IsNotEmpty({ message: 'Celular não pode estar vazio' })
  celular: string;

  @ApiPropertyOptional({ enum: InteressadoStatus, example: InteressadoStatus.LEAD })
  @IsOptional()
  @IsEnum(InteressadoStatus, { message: 'Status inválido' })
  status?: InteressadoStatus;
}
