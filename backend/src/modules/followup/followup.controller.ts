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
import { FollowupService } from './followup.service';
import { CreateFollowupDto } from './dto/create-followup.dto';
import { UpdateFollowupDto } from './dto/update-followup.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { UserRole } from '@common/enums';
import { User } from '@modules/users/entities/user.entity';

@ApiTags('followup')
@Controller('followup')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FollowupController {
  constructor(private readonly followupService: FollowupService) {}

  @Post()
  @ApiOperation({ summary: 'Criar follow-up' })
  @ApiResponse({ status: 201, description: 'Follow-up criado com sucesso' })
  create(@Body() createFollowupDto: CreateFollowupDto, @CurrentUser() user: User) {
    return this.followupService.create(createFollowupDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar follow-ups' })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de follow-ups' })
  findAll(@Query('offset') offset: number = 0, @Query('limit') limit: number = 200) {
    return this.followupService.findAll(offset, limit);
  }

  @Get('interessado/:interessadoId')
  @ApiOperation({ summary: 'Buscar follow-ups de um interessado' })
  @ApiResponse({ status: 200, description: 'Lista de follow-ups do interessado' })
  findByInteressado(@Param('interessadoId') interessadoId: string) {
    return this.followupService.findByInteressado(interessadoId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar follow-up por ID' })
  @ApiResponse({ status: 200, description: 'Follow-up encontrado' })
  @ApiResponse({ status: 404, description: 'Follow-up não encontrado' })
  findOne(@Param('id') id: string) {
    return this.followupService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar follow-up' })
  @ApiResponse({ status: 200, description: 'Follow-up atualizado com sucesso' })
  update(
    @Param('id') id: string,
    @Body() updateFollowupDto: UpdateFollowupDto,
    @CurrentUser() user: User,
  ) {
    return this.followupService.update(id, updateFollowupDto, user.id, user.perfil);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Deletar follow-up (soft delete - apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Follow-up deletado com sucesso' })
  remove(@Param('id') id: string) {
    return this.followupService.remove(id);
  }
}
