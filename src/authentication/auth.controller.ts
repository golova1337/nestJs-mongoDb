import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RegistrationhDto } from './dto/auth.dto';
import { AuthService } from './services/auth.service';
import { RegistrationResponse } from '../helpersGlobal/response/Response';
import { ResponseSuccsesfully, Result } from './interface/auth.interface';
import { LoginDto } from './dto/login.dto';
import { AccessTokenGuard } from 'src/common/accessToken.guard';
import { Request } from 'express';
import { RefreshTokenGuard } from 'src/common/refreshToken.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //singup
  @Post('/singUp')
  @HttpCode(201)
  async singUp(@Body() user: RegistrationhDto): Promise<ResponseSuccsesfully> {
    try {
      // run the service
      const result: Result = await this.authService.singUp(user);
      //create response
      return RegistrationResponse.succsessfully(result);
    } catch (error) {}
  }

  //login
  @Get('login')
  @HttpCode(200)
  async login(@Body() user: LoginDto): Promise<ResponseSuccsesfully> {
    try {
      // run the service
      const result: Result = await this.authService.login(user);

      //create response
      return RegistrationResponse.succsessfully(result);
    } catch (error) {}
  }

  // logout
  @Get('logout')
  @HttpCode(200)
  @UseGuards(AccessTokenGuard)
  async logout(@Req() req: Request) {
    try {
      const result = await this.authService.logout(req.user['id']);
      //create response
      return RegistrationResponse.succsessfully(result);
    } catch (error) {}
  }

  //refresh
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['id'];

    const refreshToken = req.user['refreshToken'];

    return this.authService.refreshTokens(userId, refreshToken);
  }
}
