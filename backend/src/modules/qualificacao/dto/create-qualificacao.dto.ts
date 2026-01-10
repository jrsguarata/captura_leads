import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQualificacaoDto {
  @ApiProperty({ example: 'Qual seu nível de conhecimento em programação?' })
  @IsString({ message: 'Questão deve ser uma string' })
  @IsNotEmpty({ message: 'Questão não pode estar vazia' })
  questao: string;

  @ApiProperty({ example: false })
  @IsBoolean({ message: 'Obrigatoriedade deve ser um boolean' })
  obrigatoriedade: boolean;

  @ApiPropertyOptional({
    example: 'Iniciante;Intermediário;Avançado',
    description: 'Opções separadas por ponto e vírgula',
  })
  @IsOptional()
  @IsString({ message: 'Opções devem ser uma string' })
  opcoes?: string;
}
