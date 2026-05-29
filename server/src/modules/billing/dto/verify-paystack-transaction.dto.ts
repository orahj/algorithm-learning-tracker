import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class VerifyPaystackTransactionDto {
  @ApiProperty({ example: 'abc123reference' })
  @IsString()
  @MinLength(4)
  reference: string;
}
