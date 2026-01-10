import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RespostasService } from './respostas.service';
import { CreateRespostaDto } from './dto/create-resposta.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { UserRole } from '@common/enums';
import { User } from '@modules/users/entities/user.entity';

@ApiTags('respostas')
@Controller('respostas')
export class RespostasController {
  constructor(private readonly respostasService: RespostasService) {}

  @Post()
  @ApiOperation({ summary: 'Criar resposta (público para landing page)' })
  @ApiResponse({ status: 201, description: 'Resposta criada com sucesso' })
  create(@Body() createRespostaDto: CreateRespostaDto) {
    return this.respostasService.create(createRespostaDto);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Criar múltiplas respostas (público para landing page)' })
  @ApiResponse({ status: 201, description: 'Respostas criadas com sucesso' })
  createBatch(@Body() respostas: CreateRespostaDto[]) {
    return this.respostasService.createBatch(respostas);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar respostas' })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de respostas' })
  findAll(@Query('offset') offset?: string, @Query('limit') limit?: string) {
    const parsedOffset = offset ? parseInt(offset, 10) : 0;
    const parsedLimit = limit ? parseInt(limit, 10) : 200;
    return this.respostasService.findAll(parsedOffset, parsedLimit);
  }

  @Get('interessado/:interessadoId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar respostas de um interessado' })
  @ApiResponse({ status: 200, description: 'Lista de respostas do interessado' })
  findByInteressado(@Param('interessadoId') interessadoId: string) {
    return this.respostasService.findByInteressado(interessadoId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar resposta por ID' })
  @ApiResponse({ status: 200, description: 'Resposta encontrada' })
  @ApiResponse({ status: 404, description: 'Resposta não encontrada' })
  findOne(@Param('id') id: string) {
    return this.respostasService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar resposta (soft delete - apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Resposta deletada com sucesso' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.respostasService.remove(id, user.id);
  }
}
