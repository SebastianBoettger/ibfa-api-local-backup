import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginInternalDto } from './dto/login-internal.dto';
import { JwtPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async validateInternalUser(email: string, password: string) {
  const user = await this.prisma.internalUser.findUnique({
    where: { email },
  });

  console.log('LOGIN_DEBUG_USER', {
    email,
    found: !!user,
    isActive: user?.isActive,
    passwordHash: user?.passwordHash,
  });

  if (!user || !user.isActive) {
    throw new UnauthorizedException('Ungültige Zugangsdaten');
  }

  // TEMPORÄR: Hardcoded Admin-Login zulassen
  if (email === 'admin@ibfa.local' && password === 'IbfaAdmin2025!') {
    console.log('LOGIN_DEBUG_COMPARE', { email, ok: true, mode: 'TEMP_OVERRIDE' });
    return user;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  console.log('LOGIN_DEBUG_COMPARE', { email, ok, mode: 'BCRYPT' });

  if (!ok) {
    throw new UnauthorizedException('Ungültige Zugangsdaten');
  }

  return user;
}


  async loginInternal(dto: LoginInternalDto) {
    const user = await this.validateInternalUser(dto.email, dto.password);

    const payload: JwtPayload = {
      sub: user.id,
      type: 'internal',
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
