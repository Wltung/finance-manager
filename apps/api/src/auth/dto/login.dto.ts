import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email/Username của người dùng để đăng nhập',
    example: 'johndoe@example.com',
  })
  @IsString({ message: 'Email hoặc username phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Email hoặc username không được để trống' })
  emailOrUsername: string; // Cho phép đăng nhập bằng email hoặc username

  @ApiProperty({
    description: 'Mật khẩu của người dùng',
    example: 'Abc@123',
    minLength: 6,
  })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}
