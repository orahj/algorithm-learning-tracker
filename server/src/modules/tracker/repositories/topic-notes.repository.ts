import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TopicNote } from '../entities/topic-note.entity';

@Injectable()
export class TopicNotesRepository {
  constructor(
    @InjectRepository(TopicNote)
    private readonly repository: Repository<TopicNote>
  ) {}

  findAllForUser(userId: string) {
    return this.repository.find({
      where: { userId },
      order: { topic: 'ASC' }
    });
  }

  async upsertForUser(userId: string, topic: string, content: string) {
    const existing = await this.repository.findOne({ where: { userId, topic } });
    if (existing) return this.repository.save({ ...existing, content });
    return this.repository.save(this.repository.create({ userId, topic, content }));
  }
}
