import {
	Injectable,
	NotFoundException,
	BadRequestException,
	ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';
import { Op, UniqueConstraintError } from 'sequelize';
import { IUser } from '@T/user/user';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User)
		private readonly userModel: typeof User,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const existingUser = await this.userModel.findOne({
			where: {
				[Op.or]: [
					{ email: createUserDto.email },
					{ username: createUserDto.username },
				],
			},
		});
		if (existingUser) {
			throw new ConflictException(
				'User with this email or username already exists',
			);
		}

		try {
			return await this.userModel.create(createUserDto);
		} catch (error) {
			if (error instanceof UniqueConstraintError) {
				throw new ConflictException('User with such email/username exists');
			}
			throw new BadRequestException(error.message);
		}
	}

	async findAll(): Promise<User[]> {
		return this.userModel.findAll();
	}

	async findOne(id: string): Promise<User> {
		const user = await this.userModel.findByPk(id);
		if (!user) {
			throw new NotFoundException(`User with id "${id}" not found`);
		}
		return user;
	}

	async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		const user = await this.findOne(id);

		if (updateUserDto.email && updateUserDto.email !== user.email) {
			const emailExists = await this.userModel.findOne({
				where: { email: updateUserDto.email },
			});
			if (emailExists) {
				throw new ConflictException(
					`Email "${updateUserDto.email}" is already in use`,
				);
			}
		}

		if (updateUserDto.username && updateUserDto.username !== user.username) {
			const usernameExists = await this.userModel.findOne({
				where: { username: updateUserDto.username },
			});
			if (usernameExists) {
				throw new ConflictException(
					`Username "${updateUserDto.username}" is already taken`,
				);
			}
		}

		try {
			await user.update(updateUserDto);
			return user;
		} catch (error) {
			if (error instanceof UniqueConstraintError) {
				throw new ConflictException('Duplicate email or username');
			}
			throw new BadRequestException(error.message);
		}
	}

	async findBy(
		key: keyof Pick<IUser, 'username' | 'email'>,
		value: string,
	): Promise<User> {
		const user = await this.userModel.findOne<User>({
			where: { [`${key}`]: value },
		});
		if (!user) {
			throw new NotFoundException(`User with email "${value}" not found`);
		}
		return user;
	}

	async remove(id: string): Promise<void> {
		const user = await this.findOne(id);

		await user.destroy();
	}
}
