import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { CustomersModule } from './customers/customers.module';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MeController } from './me/me.controller';

@Module({
  imports: [PrismaModule, HealthModule, CustomersModule, AuthModule, AppointmentsModule],
  controllers: [AppController, MeController],
  providers: [AppService],
})
export class AppModule {}
