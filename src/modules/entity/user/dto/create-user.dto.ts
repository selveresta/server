import { ICreateUserDto } from '@T/user/dto/user.dto';
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator';

export class CreateUserDto implements ICreateUserDto {
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password: string;

	@IsOptional()
	@IsString()
	avatarUrl?: string;
}
