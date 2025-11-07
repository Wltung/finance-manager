import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  Matches,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email người dùng',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'Tên người dùng (username)',
  })
  @IsString({ message: 'Username phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Username không được để trống' })
  @MinLength(3, { message: 'Username phải có ít nhất 3 ký tự' })
  @MaxLength(20, { message: 'Username không được quá 20 ký tự' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username chỉ được chứa chữ, số và dấu gạch dưới' })
  username: string;

  @ApiProperty({
    example: '12345678',
    description: 'Mật khẩu (ít nhất 8 ký tự)',
  })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
  })
  password: string;

  @ApiProperty({ example: 'Nguyen Van A', description: 'Họ và tên đầy đủ của người dùng' })
  @IsOptional()
  @IsString({ message: 'Họ tên phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Họ tên không được quá 100 ký tự' })
  fullName?: string;
}
