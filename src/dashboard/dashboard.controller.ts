import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles } from '../decorator/customize';
import { Role } from '../enum/role.enum';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @Roles(Role.Admin)
  async findAll() {
    const result = await this.dashboardService.findAll();
    return {
      data: result,
      message: 'Dashboard fetched successfully',
    };
  }
}
