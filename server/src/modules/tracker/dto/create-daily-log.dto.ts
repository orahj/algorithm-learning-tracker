import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateDailyLogDto {
  @IsDateString()
  date: string;

  @IsString()
  language: string;

  @IsString()
  topic: string;

  @IsString()
  problemName: string;

  @IsString()
  platform: string;

  @IsString()
  difficulty: string;

  @IsString()
  status: string;

  @IsInt()
  @Min(0)
  timeSpent: number;

  @IsOptional()
  @IsString()
  mistakeMade?: string;

  @IsOptional()
  @IsString()
  patternLearned?: string;

  @IsOptional()
  @IsDateString()
  repeatDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
