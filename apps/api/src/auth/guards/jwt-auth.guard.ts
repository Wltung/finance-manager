import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // If there's an error or no user, throw an UnauthorizedException
    if (err || !user) {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      
      if (!token) {
        throw new UnauthorizedException('Token không được cung cấp');
      }
      
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token đã hết hạn');
      }
      
      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token không hợp lệ');
      }
      
      throw new UnauthorizedException('Xác thực thất bại');
    }
    
    return user;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
