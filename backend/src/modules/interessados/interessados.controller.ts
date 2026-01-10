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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InteressadosService } from './interessados.service';
import { CreateInteressadoDto } from './dto/create-interessado.dto';
import { UpdateInteressadoDto } from './dto/update-interessado.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { UserRole, InteressadoStatus } from '@common/enums';
import { User } from '@modules/users/entities/user.entity';

@ApiTags('interessados')
@Controller('interessados')
export class InteressadosController {
  constructor(private readonly interessadosService: InteressadosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar interessado (público ou autenticado)' })
  @ApiResponse({ status: 201, description: 'Interessado criado com sucesso' })
  create(@Body() createInteressadoDto: CreateInteressadoDto) {
    // Endpoint público para landing page
    return this.interessadosService.create(createInteressadoDto);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar interessado (área administrativa)' })
  @ApiResponse({ status: 201, description: 'Interessado criado com sucesso' })
  createAdmin(@Body() createInteressadoDto: CreateInteressadoDto, @CurrentUser() user: User) {
    return this.interessadosService.create(createInteressadoDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar interessados' })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de interessados' })
  findAll(@Query('offset') offset: number = 0, @Query('limit') limit: number = 200) {
    return this.interessadosService.findAll(offset, limit);
  }

  @Get('status/:status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar interessados por status' })
  @ApiResponse({ status: 200, description: 'Lista de interessados por status' })
  findByStatus(@Param('status') status: InteressadoStatus) {
    return this.interessadosService.findByStatus(status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar interessado por ID' })
  @ApiResponse({ status: 200, description: 'Interessado encontrado' })
  @ApiResponse({ status: 404, description: 'Interessado não encontrado' })
  findOne(@Param('id') id: string) {
    return this.interessadosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar interessado' })
  @ApiResponse({ status: 200, description: 'Interessado atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Interessado não encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateInteressadoDto: UpdateInteressadoDto,
    @CurrentUser() user: User,
  ) {
    return this.interessadosService.update(id, updateInteressadoDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar interessado (soft delete - apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Interessado deletado com sucesso' })
  remove(@Param('id') id: string) {
    return this.interessadosService.remove(id);
  }
}
