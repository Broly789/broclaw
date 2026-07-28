import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { ConfigResponseDto } from './dto/config-response.dto';
import { SaveConfigDto } from './dto/agents.schema';
import type { AgentsConfig } from './interfaces/agents-config.interface';

@ApiTags('Agents Config')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get('config')
  @ApiOperation({
    summary: '获取全部配置',
    description: '读取 agents / models / tools 所有配置数据',
  })
  @ApiResponse({
    status: 200,
    type: ConfigResponseDto,
    description: '配置数据',
  })
  getConfig(): AgentsConfig {
    return this.agentsService.getConfig();
  }

  @Post('config')
  @ApiOperation({
    summary: '保存配置',
    description:
      '全量保存 agents / models / tools 配置，缺失的 section 保持不变',
  })
  @ApiCreatedResponse({ type: ConfigResponseDto, description: '保存成功' })
  saveConfig(@Body() dto: SaveConfigDto): AgentsConfig {
    return this.agentsService.saveConfig(dto);
  }
}
