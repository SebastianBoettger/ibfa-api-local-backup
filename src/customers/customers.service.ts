import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAllForList() {
    return this.prisma.customer.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        legacyId: true,
        name: true,
        city: true,
        zipCode: true,
        street: true,
        email: true,
        phone: true,
        isActive: true,
        extra: true,
      },
    });
  }

  async create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        name: dto.name,
        email: dto.email ?? null,
        street: dto.street ?? null,
        zipCode: dto.zipCode ?? null,
        city: dto.city ?? null,
        phone: dto.phone ?? null,
        legacyId: dto.legacyId ?? null,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.customer.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const existing = await this.prisma.customer.findUnique({
      where: { id },
      select: { extra: true },
    });
  
    const mergedExtra =
      dto.extra !== undefined
        ? { ...((existing?.extra as any) ?? {}), ...(dto.extra as any) }
        : undefined;
  
    return this.prisma.customer.update({
      where: { id },
      data: {
        name: dto.name ?? undefined,
        email: dto.email ?? undefined,
        street: dto.street ?? undefined,
        zipCode: dto.zipCode ?? undefined,
        city: dto.city ?? undefined,
        phone: dto.phone ?? undefined,
        legacyId: dto.legacyId !== undefined ? dto.legacyId : undefined,
        isActive: dto.isActive ?? undefined,
        extra: mergedExtra,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.customer.delete({ where: { id } });
  }

  async updateByLegacyId(legacyId: number, dto: UpdateCustomerDto) {
    const existing = await this.prisma.customer.findUnique({
      where: { legacyId },
      select: { extra: true },
    });
  
    if (!existing) {
      // sauberer 404 statt Prisma-P2025
      throw new Error(`Customer with legacyId ${legacyId} not found`);
    }
  
    const mergedExtra =
      dto.extra !== undefined
        ? { ...((existing.extra as any) ?? {}), ...(dto.extra as any) }
        : undefined;
  
    return this.prisma.customer.update({
      where: { legacyId },
      data: {
        name: dto.name ?? undefined,
        email: dto.email ?? undefined,
        street: dto.street ?? undefined,
        zipCode: dto.zipCode ?? undefined,
        city: dto.city ?? undefined,
        phone: dto.phone ?? undefined,
        legacyId: dto.legacyId !== undefined ? dto.legacyId : undefined,
        isActive: dto.isActive ?? undefined,
        extra: mergedExtra,
      },
    });
  }
}
