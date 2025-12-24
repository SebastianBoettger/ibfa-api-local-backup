import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRoleInternal } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Roles(UserRoleInternal.ADMIN, UserRoleInternal.PLANNER)
  @UseGuards(RolesGuard)
  async findAll() {
    return this.customersService.findAllForList();
  }

  @Post()
  @Roles(UserRoleInternal.ADMIN)
  @UseGuards(RolesGuard)
  async create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }

  @Get(':id')
  @Roles(UserRoleInternal.ADMIN, UserRoleInternal.PLANNER)
  @UseGuards(RolesGuard)
  async findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRoleInternal.ADMIN)
  @UseGuards(RolesGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.customersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRoleInternal.ADMIN)
  @UseGuards(RolesGuard)
  async remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
