import { ICreateUserDto, RegisterUserDto } from 'arli_schema';

export class RegisterUserDTO
	extends ICreateUserDto
	implements RegisterUserDto {}
