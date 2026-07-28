import { ApiProperty } from '@nestjs/swagger';

export class ApiSuccessResponseDto<T = unknown> {
  @ApiProperty({ example: 0, description: '接口状态码：0 代表成功' })
  code: number;

  data: T;

  @ApiProperty({ example: 'success', description: '提示消息' })
  msg: string;
}

export class ApiErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTP 状态码' })
  code: number;

  @ApiProperty({ nullable: true, example: null })
  data: null;

  @ApiProperty({ example: 'Bad Request', description: '错误提示消息' })
  msg: string;

  @ApiProperty({ example: 'BadRequestException', description: '异常类型' })
  error: string;
}
