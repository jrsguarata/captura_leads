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
import { DuvidasService } from './duvidas.service';
import { CreateDuvidaDto } from './dto/create-duvida.dto';
import { UpdateDuvidaDto } from './dto/update-duvida.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { UserRole, DuvidaStatus } from '@common/enums';
import { User } from '@modules/users/entities/user.entity';

@ApiTags('duvidas')
@Controller('duvidas')
export class DuvidasController {
  constructor(private readonly duvidasService: DuvidasService) {}

  @Post()
  @ApiOperation({ summary: 'Criar dúvida (público para landing page)' })
  @ApiResponse({ status: 201, description: 'Dúvida criada com sucesso' })
  create(@Body() createDuvidaDto: CreateDuvidaDto) {
    // Endpoint público para landing page
    return this.duvidasService.create(createDuvidaDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar dúvidas' })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de dúvidas' })
  findAll(@Query('offset') offset: number = 0, @Query('limit') limit: number = 200) {
    return this.duvidasService.findAll(offset, limit);
  }

  @Get('status/:status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar dúvidas por status' })
  @ApiResponse({ status: 200, description: 'Lista de dúvidas por status' })
  findByStatus(@Param('status') status: DuvidaStatus) {
    return this.duvidasService.findByStatus(status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar dúvida por ID' })
  @ApiResponse({ status: 200, description: 'Dúvida encontrada' })
  @ApiResponse({ status: 404, description: 'Dúvida não encontrada' })
  findOne(@Param('id') id: string) {
    return this.duvidasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar dúvida' })
  @ApiResponse({ status: 200, description: 'Dúvida atualizada com sucesso' })
  update(
    @Param('id') id: string,
    @Body() updateDuvidaDto: UpdateDuvidaDto,
    @CurrentUser() user: User,
  ) {
    return this.duvidasService.update(id, updateDuvidaDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar dúvida (soft delete - apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Dúvida deletada com sucesso' })
  remove(@Param('id') id: string) {
    return this.duvidasService.remove(id);
  }
}
