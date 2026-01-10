import { IsNotEmpty, IsString, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class RespostaItem {
  @ApiProperty({ example: 'Qual seu nível de conhecimento em programação?' })
  @IsString({ message: 'Pergunta deve ser uma string' })
  @IsNotEmpty({ message: 'Pergunta não pode estar vazia' })
  pergunta: string;

  @ApiProperty({ example: 'Intermediário' })
  @IsString({ message: 'Resposta deve ser uma string' })
  @IsNotEmpty({ message: 'Resposta não pode estar vazia' })
  resposta: string;
}

export class CreateRespostasBatchDto {
  @ApiProperty({ example: 'uuid-do-interessado' })
  @IsUUID('4', { message: 'ID do interessado inválido' })
  @IsNotEmpty({ message: 'ID do interessado não pode estar vazio' })
  interessadoId: string;

  @ApiProperty({
    type: [RespostaItem],
    example: [
      { pergunta: 'Qual seu nível de conhecimento?', resposta: 'Intermediário' },
      { pergunta: 'Qual seu objetivo?', resposta: 'Aprender programação' },
    ],
  })
  @IsArray({ message: 'Respostas deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => RespostaItem)
  respostas: RespostaItem[];
}
