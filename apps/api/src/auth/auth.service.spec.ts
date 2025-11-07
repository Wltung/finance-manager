import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findUser: jest.fn(),
            findByEmail: jest.fn(),
            findByUsername: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                JWT_SECRET: 'test-secret',
                JWT_EXPIRES_IN: '15m',
                JWT_REFRESH_SECRET: 'test-refresh-secret',
                JWT_REFRESH_EXPIRES_IN: '7d',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        fullName: 'Test User',
      };

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        fullName: 'Test User',
        password: 'hashedPassword',
      };

      jest.spyOn(userService, 'findByEmailOrUsername').mockResolvedValue(null);
      jest.spyOn(userService, 'findByEmailOrUsername').mockResolvedValue(null);
      jest.spyOn(userService, 'create').mockResolvedValue(mockUser as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock-token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens');
      expect(result.message).toBe('Đăng ký thành công');
    });
  });
});