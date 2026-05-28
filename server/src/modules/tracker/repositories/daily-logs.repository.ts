import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDailyLogDto } from '../dto/create-daily-log.dto';
import { UpdateDailyLogDto } from '../dto/update-daily-log.dto';
import { DailyLog } from '../entities/daily-log.entity';

@Injectable()
export class DailyLogsRepository {
  constructor(
    @InjectRepository(DailyLog)
    private readonly repository: Repository<DailyLog>
  ) {}

  findAllForUser(userId: string) {
    return this.repository.find({
      where: { userId },
      order: { date: 'DESC', createdAt: 'DESC' }
    });
  }

  createForUser(userId: string, dto: CreateDailyLogDto) {
    return this.repository.save(this.repository.create({ ...dto, userId }));
  }

  async updateForUser(userId: string, id: string, dto: UpdateDailyLogDto) {
    const dailyLog = await this.repository.findOne({ where: { id, userId } });
    if (!dailyLog) throw new NotFoundException('Daily log not found');
    return this.repository.save({ ...dailyLog, ...dto });
  }

  async deleteForUser(userId: string, id: string) {
    const result = await this.repository.delete({ id, userId });
    if (!result.affected) throw new NotFoundException('Daily log not found');
    return { deleted: true };
  }
}
