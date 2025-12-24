import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInternalDto } from './dto/login-internal.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/internal')
  loginInternal(@Body() dto: LoginInternalDto) {
    return this.authService.loginInternal(dto);
  }
}
