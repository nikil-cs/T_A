import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateAdmin(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user|| !(await ( user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { userId: user.userId, username: user.username, role: user.role };
  }

  async loginAdmin(user: any) {
    const payload = { sub: user.userId, username: user.username, role: user.role };
    return {
      console : `${user.username} role:  ${user.role} logged in successfully`,
      access_token: this.jwtService.sign(payload),
    };
  }
}
