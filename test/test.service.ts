import { Injectable } from '@nestjs/common';
import { PrismaServices } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaServices) {}

  async createDummyUser() {
    await this.prismaService.user.create({
      data: {
        username: 'test1',
        name: 'test1',
        password: await bcrypt.hash('123456', 7),
      },
    });
  }

  async deleteDummyUser() {
    await this.prismaService.user.delete({
      where: { username: 'test1' },
    });
  }
}
