import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRespostaDto {
  @ApiProperty({ example: 'uuid-do-interessado' })
  @IsUUID('4', { message: 'ID do interessado inválido' })
  @IsNotEmpty({ message: 'ID do interessado não pode estar vazio' })
  interessadoId: string;

  @ApiProperty({ example: 'Qual seu nível de conhecimento em programação?' })
  @IsString({ message: 'Pergunta deve ser uma string' })
  @IsNotEmpty({ message: 'Pergunta não pode estar vazia' })
  pergunta: string;

  @ApiProperty({ example: 'Intermediário' })
  @IsString({ message: 'Resposta deve ser uma string' })
  @IsNotEmpty({ message: 'Resposta não pode estar vazia' })
  resposta: string;
}
