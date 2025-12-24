import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRoleInternal } from '@prisma/client';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @Roles(UserRoleInternal.ADMIN, UserRoleInternal.PLANNER)
  @UseGuards(RolesGuard)
  findAll() {
    return this.appointmentsService.findAllSortedDesc();
  }

  @Get('due')
  @Roles(UserRoleInternal.ADMIN, UserRoleInternal.PLANNER)
  @UseGuards(RolesGuard)
  findDue() {
    return this.appointmentsService.findDueNextMonths();
  }

  @Get('history')
  getHistory() {
    return this.appointmentsService.findPastSortedDesc();
  }

  @Get('due')
  getDue() {
    return this.appointmentsService.findDuePerCustomer();
  }

}
