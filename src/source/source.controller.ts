import { AuthGuard } from '@app/auth/guards/auth.guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('sources')
export class SourceController {}
