import { IsEmail, IsNotEmpty, IsString, Length, IsEnum, IsOptional, Matches } from 'class-validator';
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

  // === Dados Pessoais ===

  @ApiPropertyOptional({ example: '12345678901', description: 'CPF com 11 dígitos' })
  @IsOptional()
  @IsString({ message: 'CPF deve ser uma string' })
  @Length(11, 11, { message: 'CPF deve ter exatamente 11 dígitos' })
  @Matches(/^\d{11}$/, { message: 'CPF deve conter apenas números' })
  cpf?: string;

  @ApiPropertyOptional({ example: '01001000', description: 'CEP com 8 dígitos' })
  @IsOptional()
  @IsString({ message: 'CEP deve ser uma string' })
  @Length(8, 8, { message: 'CEP deve ter exatamente 8 dígitos' })
  @Matches(/^\d{8}$/, { message: 'CEP deve conter apenas números' })
  cep?: string;

  @ApiPropertyOptional({ example: 'Praça da Sé' })
  @IsOptional()
  @IsString({ message: 'Logradouro deve ser uma string' })
  logradouro?: string;

  @ApiPropertyOptional({ example: 'Sé' })
  @IsOptional()
  @IsString({ message: 'Bairro deve ser uma string' })
  bairro?: string;

  @ApiPropertyOptional({ example: 'São Paulo' })
  @IsOptional()
  @IsString({ message: 'Cidade deve ser uma string' })
  cidade?: string;

  @ApiPropertyOptional({ example: 'SP' })
  @IsOptional()
  @IsString({ message: 'Estado deve ser uma string' })
  @Length(2, 2, { message: 'Estado deve ter exatamente 2 caracteres' })
  estado?: string;

  @ApiPropertyOptional({ example: '100' })
  @IsOptional()
  @IsString({ message: 'Número deve ser uma string' })
  numero?: string;

  @ApiPropertyOptional({ example: 'Apto 42' })
  @IsOptional()
  @IsString({ message: 'Complemento deve ser uma string' })
  complemento?: string;

  // === Dados Profissionais ===

  @ApiPropertyOptional({ example: 'Médico' })
  @IsOptional()
  @IsString({ message: 'Profissão deve ser uma string' })
  profissao?: string;

  @ApiPropertyOptional({ example: 'CRM 12345' })
  @IsOptional()
  @IsString({ message: 'Registro no conselho deve ser uma string' })
  registroConselho?: string;

  @ApiPropertyOptional({ example: '5 anos' })
  @IsOptional()
  @IsString({ message: 'Tempo de experiência deve ser uma string' })
  tempoExperiencia?: string;

  @ApiPropertyOptional({ example: '01001000', description: 'CEP profissional com 8 dígitos' })
  @IsOptional()
  @IsString({ message: 'CEP profissional deve ser uma string' })
  @Length(8, 8, { message: 'CEP profissional deve ter exatamente 8 dígitos' })
  @Matches(/^\d{8}$/, { message: 'CEP profissional deve conter apenas números' })
  cepProfissional?: string;

  @ApiPropertyOptional({ example: 'Av. Paulista' })
  @IsOptional()
  @IsString({ message: 'Logradouro profissional deve ser uma string' })
  logradouroProfissional?: string;

  @ApiPropertyOptional({ example: 'Bela Vista' })
  @IsOptional()
  @IsString({ message: 'Bairro profissional deve ser uma string' })
  bairroProfissional?: string;

  @ApiPropertyOptional({ example: 'São Paulo' })
  @IsOptional()
  @IsString({ message: 'Cidade profissional deve ser uma string' })
  cidadeProfissional?: string;

  @ApiPropertyOptional({ example: 'SP' })
  @IsOptional()
  @IsString({ message: 'Estado profissional deve ser uma string' })
  @Length(2, 2, { message: 'Estado profissional deve ter exatamente 2 caracteres' })
  estadoProfissional?: string;

  @ApiPropertyOptional({ example: '1000' })
  @IsOptional()
  @IsString({ message: 'Número profissional deve ser uma string' })
  numeroProfissional?: string;

  @ApiPropertyOptional({ example: 'Sala 501' })
  @IsOptional()
  @IsString({ message: 'Complemento profissional deve ser uma string' })
  complementoProfissional?: string;
}
