import { ApiProperty } from '@nestjs/swagger';
import {
  AgentConfigDto,
  ModelConfigDto,
  ToolConfigDto,
} from './agents.schema';

export class ConfigDataDto {
  @ApiProperty({ type: [AgentConfigDto], description: 'Agent 列表' })
  agents: AgentConfigDto[];

  @ApiProperty({ type: [ModelConfigDto], description: 'Model 列表' })
  models: ModelConfigDto[];

  @ApiProperty({ type: [ToolConfigDto], description: 'Tool 列表' })
  tools: ToolConfigDto[];
}

export class ConfigResponseDto {
  @ApiProperty({ type: ConfigDataDto })
  data: ConfigDataDto;
}

export class SaveConfigResponseDto extends ConfigResponseDto {
  @ApiProperty({ description: '操作是否成功', example: true })
  success: boolean;
}