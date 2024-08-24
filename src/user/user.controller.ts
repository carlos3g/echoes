import { Controller } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller('users')
export class UserController {}
