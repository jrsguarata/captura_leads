import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@common/enums';

export class RegisterDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome não pode estar vazio' })
  nome: string;

  @ApiProperty({ example: 'joao@example.com' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email não pode estar vazio' })
  email: string;

  @ApiProperty({ example: 'senha123' })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.OPERATOR })
  @IsEnum(UserRole, { message: 'Perfil inválido' })
  perfil: UserRole;
}
