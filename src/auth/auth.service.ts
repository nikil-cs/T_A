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
    const admin = await this.prisma.user.findUnique({ where: { username } });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { id: admin.id, username: admin.username, role: admin.role };
  }

  async loginAdmin(admin: any) {
    const payload = { sub: admin.id, username: admin.username, role: admin.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
