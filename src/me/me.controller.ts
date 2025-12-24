import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('me')
@UseGuards(AuthGuard('jwt'))
export class MeController {
  constructor(private prisma: PrismaService) {}

  @Get('settings')
  async getSettings(@Req() req: any) {
    const userId = req.user?.sub;
    const user = await this.prisma.internalUser.findUnique({
      where: { id: userId },
      select: { settings: true },
    });
    return user?.settings ?? {};
  }

  @Patch('settings')
  async patchSettings(@Req() req: any, @Body() body: any) {
    const userId = req.user?.sub;

    const current = await this.prisma.internalUser.findUnique({
      where: { id: userId },
      select: { settings: true },
    });

    const merged = { ...(current?.settings as any ?? {}), ...(body ?? {}) };

    await this.prisma.internalUser.update({
      where: { id: userId },
      data: { settings: merged },
    });

    return merged;
  }
}
