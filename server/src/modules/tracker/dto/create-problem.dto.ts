import { IsDateString, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProblemDto {
  @IsString()
  name: string;

  @IsString()
  topic: string;

  @IsString()
  language: string;

  @IsString()
  difficulty: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  link?: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsDateString()
  lastAttemptedDate?: string;

  @IsOptional()
  @IsDateString()
  repeatDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
