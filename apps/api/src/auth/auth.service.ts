import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Tokens } from './interfaces/tokens.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto, ForgotPasswordDto, LoginUserDto, RegisterUserDto, ResetPasswordDto, ValidateResetTokenDto } from './dto';
import { User } from 'src/user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { AuthResponse } from './interfaces/auth-response.interface';
import { MailService } from 'src/mail/mail.service';
import { PasswordReset } from './entities/password-reset.entity';

@Injectable()
export class AuthService {
  // In production, use Redis for better performance
  private accessTokenBlacklist = new Set<string>();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<AuthResponse> {
    try {
      // Validate unique constraints
      await this.validateUniqueConstraints(registerUserDto);

      // Hash password
      const hashedPassword = await bcrypt.hash(registerUserDto.password, 12);

      // Prepare user data
      const userData = {
        email: registerUserDto.email,
        username: registerUserDto.username,
        password: hashedPassword,
        fullName: registerUserDto.fullName,
      };

      // Create user
      const user = await this.userService.create(userData);

      // Generate token
      const tokens = this.generateToken(user.id, user.email, 1);

      // Store refresh token in database (this was missing!)
      await this.storeRefreshToken(user.id, tokens.refreshToken);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: this.sanitizeUser(user),
        message: 'Đăng ký thành công',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponse> {
    // Tìm user bằng email hoặc username
    const user = await this.userService.findByEmailOrUsername(loginUserDto.emailOrUsername);
    if (!user) {
      throw new UnauthorizedException('Email/Username hoặc mật khẩu không đúng');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email/Username hoặc mật khẩu không đúng');
    }

    // Kiểm tra tài khoản có bị xóa không
    if (user.deletedAt) {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }

    // Get user's current access token (if any) and blacklist it
    await this.blacklistUserAccessTokens(user.id);

    // Revoke all existing refresh tokens for this user
    await this.revokeAllUserRefreshTokens(user.id);

    // Generate new tokens
    const tokens = this.generateToken(user.id, user.email, 1);

    // Store new refresh token in database
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: this.sanitizeUser(user),
      message: 'Đăng nhập thành công',
    };
  }

  async refreshToken(refreshToken: string): Promise<Tokens> {
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // 2. Check if refresh token exists and is not revoked
      const storedToken = await this.refreshTokenRepository.findOne({
        where: { 
          token: refreshToken, 
          isRevoked: false,
          userId: payload.sub 
        },
        relations: ['user']
      });

      if (!storedToken) {
        throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã bị thu hồi');
      }

      // 3. Check if token is expired
      if (storedToken.expiresAt < new Date()) {
        await this.refreshTokenRepository.update(storedToken.id, { isRevoked: true });
        throw new UnauthorizedException('Refresh token đã hết hạn');
      }

      // 4. Revoke the current refresh token
      await this.refreshTokenRepository.update(storedToken.id, { isRevoked: true });

      // 5. Generate new tokens
      const newTokens = this.generateToken(storedToken.user.id, storedToken.user.email, 1);

      // 6. Store new refresh token
      await this.storeRefreshToken(storedToken.user.id, newTokens.refreshToken);

      return newTokens;
    } catch (error) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    try {
      // 1. Tìm kiếm người dùng
      const user = await this.userService.findByEmailOrUsername(email);
      
      if (user && !user.deletedAt) {
        // 2. Tạo token reset ngẫu nhiên
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // 3. Tạo thời gian hết hạn (15 phút)
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);
        
        // 4. Hash token
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        
        // 5. Xóa các token reset cũ của user này (nếu có)
        await this.passwordResetRepository.delete({ userId: user.id });
        
        // 6. Lưu token vào CSDL
        await this.passwordResetRepository.save({
          hashedToken,
          userId: user.id,
          expiresAt,
        });
        
        // 7. Gửi email
        await this.mailService.sendPasswordResetEmail(email, resetToken);
      }
      
      // 8. Luôn trả về thông báo thành công (bảo mật)
      return { message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu' };
    } catch (error) {
      console.error('Forgot password error:', error);
      // Vẫn trả về thông báo thành công để không lộ thông tin
      return { message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu' };
    }
  }

  private async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const expiresAt = new Date();
    const expiresInDays = this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d');

    // Parse expiration (assuming format like "7d")
    const days = parseInt(expiresInDays.replace('d', ''));
    expiresAt.setDate(expiresAt.getDate() + days);

    await this.refreshTokenRepository.save({
      token: refreshToken,
      userId,
      expiresAt,
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    try {
      
      // 1. Hash token nhận được
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      
      // 2. Tìm token trong CSDL
      const passwordReset = await this.passwordResetRepository.findOne({
        where: { 
          hashedToken,
          usedAt: null, // Chưa được sử dụng
        },
        relations: ['user'],
      });

      // 6. Kiểm tra mật khẩu mới không trùng với mật khẩu cũ
      const user = await this.userService.findById(passwordReset.userId);
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        throw new BadRequestException('Mật khẩu mới phải khác mật khẩu hiện tại');
      }

      // 7. Hash mật khẩu mới
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // 8. Cập nhật mật khẩu
      await this.userService.updatePassword(passwordReset.userId, hashedNewPassword);

      // 9. Đánh dấu token đã được sử dụng
      await this.passwordResetRepository.update(passwordReset.id, {
        usedAt: new Date(),
      });

      // 10. Blacklist tất cả access tokens của user (force re-login)
      await this.blacklistUserAccessTokens(passwordReset.userId);

      // 11. Revoke tất cả refresh tokens của user
      await this.revokeAllUserRefreshTokens(passwordReset.userId);

      // 12. Gửi email thông báo mật khẩu đã được thay đổi
      await this.mailService.sendPasswordChangedNotification(passwordReset.user.email);

      return { message: 'Mật khẩu đã được đặt lại thành công' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Reset password error:', error);
      throw new BadRequestException('Có lỗi xảy ra khi đặt lại mật khẩu');
    }
  }

  async validateResetToken(validateResetTokenDto: ValidateResetTokenDto): Promise<{ valid: boolean; message?: string }> {
    const { token } = validateResetTokenDto;
  
    try {
      // 1. Hash token nhận được
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      
      // 2. Tìm token trong CSDL
      const passwordReset = await this.passwordResetRepository.findOne({
        where: { 
          hashedToken,
          usedAt: null, // Chưa được sử dụng
        },
        relations: ['user'],
      });
  
      // 3. Kiểm tra token có tồn tại không
      if (!passwordReset) {
        return { valid: false, message: 'Token không hợp lệ hoặc đã được sử dụng' };
      }

      // 3.1 Kiểm tra token đã được sử dụng chưa
      if (passwordReset.usedAt !== null) {
        return { valid: false, message: 'Token đã được sử dụng' };
      }
  
      // 4. Kiểm tra token có hết hạn không
      if (passwordReset.expiresAt < new Date()) {
        return { valid: false, message: 'Token đã hết hạn' };
      }
  
      // 5. Kiểm tra user có tồn tại và không bị xóa
      if (!passwordReset.user || passwordReset.user.deletedAt) {
        return { valid: false, message: 'Người dùng không tồn tại hoặc đã bị vô hiệu hóa' };
      }
  
      return { valid: true };
    } catch (error) {
      console.error('Validate reset token error:', error);
      return { valid: false, message: 'Có lỗi xảy ra khi kiểm tra token' };
    }
  }

  private async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true }
    );
  }

  async logout(accessToken: string, refreshToken: string): Promise<void> {
    // Blacklist the access token
    this.accessTokenBlacklist.add(accessToken);

    // Revoke the refresh token
    await this.refreshTokenRepository.update(
      { token: refreshToken },
      { isRevoked: true }
    );
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    // Tìm user
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }
    
    // Kiểm tra tài khoản có bị xóa không
    if (user.deletedAt) {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }

    // Kiểm tra mật khẩu hiện tại
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    // Kiểm tra mật khẩu mới không trùng với mật khẩu cũ
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('Mật khẩu mới phải khác mật khẩu hiện tại');
    }

    // Hash mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Cập nhật mật khẩu
    await this.userService.updatePassword(userId, hashedNewPassword);

    // Blacklist tất cả access tokens của user (force re-login)
    await this.blacklistUserAccessTokens(userId);

    // Revoke tất cả refresh tokens của user
    await this.revokeAllUserRefreshTokens(userId);
  }

  // Private methods
  private async validateUniqueConstraints(registerUserDto: RegisterUserDto) {
    // Check email
    const existingEmailUser = await this.userService.findByEmailOrUsername(registerUserDto.email);
    if (existingEmailUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Check username if provided
    if (registerUserDto.username) {
      const existingUsernameUser = await this.userService.findByEmailOrUsername(
        registerUserDto.username,
      );
      if (existingUsernameUser) {
        throw new ConflictException('Username đã được sử dụng');
      }
    }
  }

  isAccessTokenBlacklisted(token: string): boolean {
    return this.accessTokenBlacklist.has(token);
  }

  private async blacklistUserAccessTokens(userId: string): Promise<void> {}

  private generateToken(userId: string, email: string, version: number): Tokens {
    const payload: JwtPayload = { sub: userId, email, tokenVersion: version };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...result } = user;
    return result;
  }

  async checkEmailAvailability(email: string): Promise<boolean> {
    const user = await this.userService.findByEmailOrUsername(email);
    return !user;
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const user = await this.userService.findByEmailOrUsername(username);
    return !user;
  }
}
