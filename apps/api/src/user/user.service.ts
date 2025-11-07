import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: users,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findById(id: string): Promise<User | undefined> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .addSelect('user.password')
      .getOne();
  }

  async findByEmailOrUsername(emailOrUsername: string): Promise<User | undefined> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :emailOrUsername OR user.username = :emailOrUsername', {
        emailOrUsername,
      })
      .addSelect('user.password')
      .getOne();
  }

  create(data: Partial<User>) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  update(id: string, updateUserDto: Partial<User>) {
    return this.userRepository.update(id, updateUserDto);
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    const result = await this.userRepository.update(id, { 
      password: hashedPassword,
      updatedAt: new Date()
    });
    
    if (result.affected === 0) {
      throw new NotFoundException(`Không thể cập nhật mật khẩu`);
    }
  }

  async delete(id: string) {
    const user = await this.findUser(id);
    user.deletedAt = new Date();
    return this.userRepository.save(user);
  }
}
