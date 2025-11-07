import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token reset mật khẩu từ email',
    example: 'abc123def456...',
  })
  @IsString({ message: 'Token phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Token không được để trống' })
  token: string;

  @ApiProperty({
    description: 'Mật khẩu mới (phải khác mật khẩu cũ)',
    example: 'NewPassword123',
    minLength: 6,
  })
  @IsString({ message: 'Mật khẩu mới phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Mật khẩu mới phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
  })
  newPassword: string;
}