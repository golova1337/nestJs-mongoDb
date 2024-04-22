import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RegistrationhDto } from './dto/auth-dto';
import { AuthService } from './services/auth.service';
import { Response } from '../helpers/response/Response';
import { Result } from './interface/auth-interface';
import { LoginDto } from './dto/login-dto';
import { AccessTokenGuard } from 'src/utils/common/accessToken.guard';
import { Request } from 'express';
import { RefreshTokenGuard } from 'src/utils/common/refreshToken.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { RolesGuard } from 'src/utils/roles/roles.guard';
import { responseSuccesfully } from '../helpers/types/response-type';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //singup
  @Post('/singUp')
  @HttpCode(201)
  async singUp(@Body() user: RegistrationhDto): Promise<responseSuccesfully> {
    // run the service
    const result: Result = await this.authService.singUp(user);
    //create response
    return Response.succsessfully(result);
  }

  //login
  @Get('login')
  @HttpCode(200)
  async login(@Body() user: LoginDto): Promise<responseSuccesfully> {
    // run the service
    const result: Result = await this.authService.login(user);

    //create response
    return Response.succsessfully(result);
  }

  // logout
  @Get('logout')
  @HttpCode(200)
  @UseGuards(AccessTokenGuard)
  async logout(@Req() req: Request): Promise<responseSuccesfully> {
    // run the service
    const result: Result = await this.authService.logout(req.user['id']);

    //create response
    return Response.succsessfully(result);
  }

  //refresh
  @Roles('user')
  @UseGuards(RefreshTokenGuard, RolesGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: Request): Promise<responseSuccesfully> {
    const userId = req.user['id'];

    const refreshToken = req.user['refreshToken'];

    const result: Result = await this.authService.refreshTokens(userId, refreshToken);

    //create response
    return Response.succsessfully(result);
  }
}
