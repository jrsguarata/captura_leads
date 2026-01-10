import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, currentUserId?: string): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já existe');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      criadoPor: currentUserId,
    });

    return this.usersRepository.save(user);
  }

  async findAll(offset: number = 0, limit: number = 200): Promise<{ data: User[]; total: number }> {
    const [data, total] = await this.usersRepository.findAndCount({
      skip: offset,
      take: Math.min(limit, 200),
      order: { criadoEm: 'DESC' },
      withDeleted: true,
    });

    return { data, total };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'nome', 'email', 'password', 'perfil', 'isActive'],
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUserId: string,
  ): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email já existe');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    user.alteradoPor = currentUserId;

    return this.usersRepository.save(user);
  }

  async deactivate(id: string, currentUserId: string): Promise<void> {
    const user = await this.findOne(id);

    if (!user.isActive) {
      throw new BadRequestException('Usuário já está desativado');
    }

    user.isActive = false;
    user.desativadoEm = new Date();
    user.desativadoPor = currentUserId;
    user.alteradoPor = currentUserId;

    await this.usersRepository.save(user);
  }

  async activate(id: string, currentUserId: string): Promise<void> {
    const user = await this.findOne(id);

    if (user.isActive) {
      throw new BadRequestException('Usuário já está ativo');
    }

    user.isActive = true;
    user.desativadoEm = null as any;
    user.desativadoPor = null as any;
    user.alteradoPor = currentUserId;

    await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.softRemove(user);
  }
}
