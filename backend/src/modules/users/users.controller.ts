import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { UserRole } from '@common/enums';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar novo usuário (apenas ADMIN)' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 409, description: 'Email já existe' })
  create(@Body() createUserDto: CreateUserDto, @CurrentUser() user: User) {
    return this.usersService.create(createUserDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuários' })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de usuários' })
  findAll(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 200,
    @CurrentUser() user: User,
  ) {
    // OPERATOR só vê seus próprios dados
    if (user.perfil === UserRole.OPERATOR) {
      return {
        data: [user],
        total: 1,
      };
    }
    return this.usersService.findAll(offset, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    // OPERATOR só pode ver seus próprios dados
    if (user.perfil === UserRole.OPERATOR && user.id !== id) {
      throw new ForbiddenException('Acesso negado');
    }
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    // OPERATOR só pode atualizar seus próprios dados
    if (user.perfil === UserRole.OPERATOR) {
      if (user.id !== id) {
        throw new ForbiddenException('Acesso negado');
      }
      // OPERATOR não pode alterar seu perfil
      if (updateUserDto.perfil) {
        throw new ForbiddenException('Você não pode alterar seu próprio perfil');
      }
    }

    // Ninguém pode alterar seu próprio perfil
    if (user.id === id && updateUserDto.perfil) {
      throw new ForbiddenException('Você não pode alterar seu próprio perfil');
    }

    return this.usersService.update(id, updateUserDto, user.id);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Desativar usuário (apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Usuário desativado com sucesso' })
  deactivate(@Param('id') id: string, @CurrentUser() user: User) {
    return this.usersService.deactivate(id, user.id);
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Ativar usuário (apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Usuário ativado com sucesso' })
  activate(@Param('id') id: string, @CurrentUser() user: User) {
    return this.usersService.activate(id, user.id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Deletar usuário (soft delete - apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
