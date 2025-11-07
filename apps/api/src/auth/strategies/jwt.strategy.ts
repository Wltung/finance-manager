import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: JwtPayload): Promise<any> {
    // Extract the token from the request
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    
    // Check if token is blacklisted
    if (this.authService.isAccessTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token đã bị thu hồi');
    }

    // Find the user associated with the token
    const user = await this.userService.findUser(payload.sub); 

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Token không hợp lệ hoặc người dùng không tồn tại.');
    }
    
    const { password, ...result } = user;
    return result;
  }
}