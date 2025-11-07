import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ValidateResetTokenDto {
  @ApiProperty({
    description: 'Token để validate',
    example: 'abc123def456...',
  })
  @IsString({ message: 'Token phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Token không được để trống' })
  token: string;
}