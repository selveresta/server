import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ICreateUserDto, IUpdateUserDto, IUser } from 'arli_schema';
import { Op, UniqueConstraintError } from 'sequelize';

import { User } from './user.model';

import { UserNotFoundException } from '@M/exception/custom/user-not-found.exception';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User)
		private readonly userModel: typeof User,
	) {}

	async create(createUserDto: ICreateUserDto): Promise<User> {
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

	async update(id: string, updateUserDto: IUpdateUserDto): Promise<User> {
		const user = await this.findBy('id', id);

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
		key: keyof Pick<IUser, 'username' | 'email' | 'id'>,
		value: string,
	): Promise<User> {
		const user = await this.userModel.findOne<User>({
			where: { [key]: value },
		});
		if (!user) {
			throw new UserNotFoundException(`${key} "${value}"`);
		}
		return user;
	}

	async remove(id: string): Promise<void> {
		const user = await this.findBy('id', id);

		await user.destroy();
	}
}
