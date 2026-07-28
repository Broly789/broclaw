import { ApiProperty } from '@nestjs/swagger';
import { AgentConfigDto, ModelConfigDto, ToolConfigDto } from './agents.schema';

export class ConfigDataDto {
  @ApiProperty({ type: [AgentConfigDto], description: 'Agent 列表' })
  agents: AgentConfigDto[];

  @ApiProperty({ type: [ModelConfigDto], description: 'Model 列表' })
  models: ModelConfigDto[];

  @ApiProperty({ type: [ToolConfigDto], description: 'Tool 列表' })
  tools: ToolConfigDto[];
}

export class ConfigResponseDto {
  @ApiProperty({ example: 0, description: '接口状态码：0 代表成功' })
  code: number;

  @ApiProperty({ type: ConfigDataDto, description: '业务返回数据' })
  data: ConfigDataDto;

  @ApiProperty({ example: 'success', description: '提示消息' })
  msg: string;
}
