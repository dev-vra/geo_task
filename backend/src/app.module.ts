import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { SectorsModule } from './sectors/sectors.module';
import { ContractsModule } from './contracts/contracts.module';
import { CitiesModule } from './cities/cities.module';
import { TasksModule } from './tasks/tasks.module';
import { TemplatesModule } from './templates/templates.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    SectorsModule,
    ContractsModule,
    CitiesModule,
    TasksModule,
    TemplatesModule,
    DashboardModule,
  ],
})
export class AppModule {}
