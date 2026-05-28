import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProblemDto } from '../dto/create-problem.dto';
import { UpdateProblemDto } from '../dto/update-problem.dto';
import { Problem } from '../entities/problem.entity';

@Injectable()
export class ProblemsRepository {
  constructor(
    @InjectRepository(Problem)
    private readonly repository: Repository<Problem>
  ) {}

  findAllForUser(userId: string) {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  createForUser(userId: string, dto: CreateProblemDto) {
    return this.repository.save(this.repository.create({ ...dto, userId }));
  }

  async updateForUser(userId: string, id: string, dto: UpdateProblemDto) {
    const problem = await this.repository.findOne({ where: { id, userId } });
    if (!problem) throw new NotFoundException('Problem not found');
    return this.repository.save({ ...problem, ...dto });
  }

  async deleteForUser(userId: string, id: string) {
    const result = await this.repository.delete({ id, userId });
    if (!result.affected) throw new NotFoundException('Problem not found');
    return { deleted: true };
  }
}
