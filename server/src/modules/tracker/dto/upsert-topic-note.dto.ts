import { IsString } from 'class-validator';

export class UpsertTopicNoteDto {
  @IsString()
  content: string;
}
