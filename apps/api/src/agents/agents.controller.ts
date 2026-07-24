import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { ConfigResponseDto, SaveConfigResponseDto } from './dto/config-response.dto';
import { SaveConfigDto } from './dto/agents.schema';
import type { AgentsConfig } from './interfaces/agents-config.interface';

@ApiTags('Agents Config')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get('config')
  @ApiOperation({ summary: '获取全部配置', description: '读取 agents / models / tools 所有配置数据' })
  @ApiOkResponse({ type: ConfigResponseDto, description: '配置数据' })
  getConfig(): { data: AgentsConfig } {
    const config = this.agentsService.getConfig();
    return { data: config };
  }

  @Post('config')
  @ApiOperation({ summary: '保存配置', description: '全量保存 agents / models / tools 配置，缺失的 section 保持不变' })
  @ApiCreatedResponse({ type: SaveConfigResponseDto, description: '保存成功' })
  saveConfig(@Body() dto: SaveConfigDto): { data: AgentsConfig; success: boolean } {
    const config = this.agentsService.saveConfig(dto);
    return { data: config, success: true };
  }
}