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
import { QualificacaoService } from './qualificacao.service';
import { CreateQualificacaoDto } from './dto/create-qualificacao.dto';
import { UpdateQualificacaoDto } from './dto/update-qualificacao.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { UserRole } from '@common/enums';
import { User } from '@modules/users/entities/user.entity';

@ApiTags('qualificacao')
@Controller('qualificacao')
export class QualificacaoController {
  constructor(private readonly qualificacaoService: QualificacaoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar pergunta de qualificação (apenas ADMIN)' })
  @ApiResponse({ status: 201, description: 'Pergunta criada com sucesso' })
  create(@Body() createQualificacaoDto: CreateQualificacaoDto, @CurrentUser() user: User) {
    return this.qualificacaoService.create(createQualificacaoDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar perguntas de qualificação' })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de perguntas' })
  findAll(@Query('offset') offset: number = 0, @Query('limit') limit: number = 200) {
    return this.qualificacaoService.findAll(offset, limit);
  }

  @Get('active')
  @ApiOperation({ summary: 'Listar perguntas ativas (público para landing page)' })
  @ApiResponse({ status: 200, description: 'Lista de perguntas ativas' })
  findAllActive() {
    return this.qualificacaoService.findAllActive();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar pergunta por ID' })
  @ApiResponse({ status: 200, description: 'Pergunta encontrada' })
  @ApiResponse({ status: 404, description: 'Pergunta não encontrada' })
  findOne(@Param('id') id: string) {
    return this.qualificacaoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar pergunta (apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Pergunta atualizada com sucesso' })
  update(
    @Param('id') id: string,
    @Body() updateQualificacaoDto: UpdateQualificacaoDto,
    @CurrentUser() user: User,
  ) {
    return this.qualificacaoService.update(id, updateQualificacaoDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar pergunta (soft delete - apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Pergunta deletada com sucesso' })
  remove(@Param('id') id: string) {
    return this.qualificacaoService.remove(id);
  }
}
