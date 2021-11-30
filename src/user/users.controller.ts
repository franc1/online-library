import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}
}
