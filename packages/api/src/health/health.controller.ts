import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  public constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private prismaManager: PrismaManagerService
  ) {}

  @Get()
  @HealthCheck()
  public check() {
    const prismaPing = async () => this.prismaHealth.pingCheck('prisma', this.prismaManager.getNativeClient());

    return this.health.check([prismaPing]);
  }
}
