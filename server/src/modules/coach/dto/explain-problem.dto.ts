import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class ExplainProblemDto {
  @ApiProperty({ example: 'Two Sum' })
  @IsString()
  @MinLength(2)
  problemName: string;

  @ApiProperty({ example: 'HashMap' })
  @IsString()
  topic: string;

  @ApiProperty({ example: 'JavaScript' })
  @IsString()
  language: string;

  @ApiProperty({ example: 'Easy' })
  @IsString()
  difficulty: string;

  @ApiPropertyOptional({ example: 'I tried using nested loops but it was too slow.' })
  @IsOptional()
  @IsString()
  userApproach?: string;

  @ApiPropertyOptional({ example: 'function twoSum(nums, target) { ... }' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ example: 'Why does the hashmap approach work?' })
  @IsOptional()
  @IsString()
  question?: string;

  @ApiPropertyOptional({ enum: ['explain', 'hint', 'mistake_review'], example: 'explain' })
  @IsOptional()
  @IsIn(['explain', 'hint', 'mistake_review'])
  mode?: 'explain' | 'hint' | 'mistake_review';
}
