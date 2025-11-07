import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { ChangePasswordDto, ForgotPasswordDto, LoginUserDto, RefreshTokenDto, RegisterUserDto, ResetPasswordDto, ValidateResetTokenDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { LoginResponse, RefreshResponse } from './interfaces/auth-response.interface';

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201, 
    description: 'User registered successfully',
    type: 'object'
  })
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<LoginResponse> {
    const result = await this.authService.register(registerUserDto);

    // Set HttpOnly cookie for refresh token
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
      message: result.message,
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ 
    status: 200, 
    description: 'User logged in successfully',
    type: 'object'
  })
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true}) response: Response
  ): Promise<LoginResponse> {
    const result = await this.authService.login(loginUserDto);

    // Set HttpOnly cookie for refresh token
    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
      message: result.message,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{message: string}> {
    try {
      // Extract access token from Authorization header
      const authHeader = req.headers['authorization'];
      const accessToken = authHeader?.replace('Bearer ', '');

      // Extract refresh token from HttpOnly cookie
      const refreshToken = req.cookies?.refreshToken;

      if (!accessToken) {
        throw new BadRequestException('Access token không tìm thấy');
      }

      if (!refreshToken) {
        throw new BadRequestException('Refresh token không tìm thấy');
      }

      await this.authService.logout(accessToken, refreshToken);

      // Clear the HttpOnly cookie
      response.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      return { message: 'Đăng xuất thành công' };
    } catch (error) {
      throw new BadRequestException('Đăng xuất thất bại');
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  async getProfile(@CurrentUser() user: any) {
    return { user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ 
    status: 200, 
    description: 'Token refreshed successfully',
    type: 'object'
  })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<RefreshResponse> {
    try {
      // Extract refresh token from HttpOnly cookie
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new BadRequestException('Refresh token không tìm thấy');
      }

      const result = await this.authService.refreshToken(refreshToken);

      // Set new HttpOnly cookie for new refresh token
      response.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
      });

      return {
        accessToken: result.accessToken,
      };
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    type: 'object'
  })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() user: any
  ): Promise<{ message: string }> {
    await this.authService.changePassword(user.id, changePasswordDto);
    return { message: 'Đổi mật khẩu thành công' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent successfully',
    type: 'object'
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto
  ): Promise<{ message: string }> {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    type: 'object'
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto
  ): Promise<{ message: string }> {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @Post('validate-reset-token')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Token validation result',
    type: 'object'
  })
  async validateResetToken(
    @Body() validateResetTokenDto: ValidateResetTokenDto
  ): Promise<{ valid: boolean; message?: string }> {
    return await this.authService.validateResetToken(validateResetTokenDto);
  }

  @Post('check-email')
  @HttpCode(HttpStatus.OK)
  async checkEmailAvailability(@Body('email') email: string): Promise<{ available: boolean }> {
    const isAvailable = await this.authService.checkEmailAvailability(email);
    return { available: isAvailable };
  }

  @Post('check-username')
  @HttpCode(HttpStatus.OK)
  async checkUsernameAvailability(@Body('username') username: string): Promise<{ available: boolean }> {
    const isAvailable = await this.authService.checkUsernameAvailability(username);
    return { available: isAvailable };
  }
}
