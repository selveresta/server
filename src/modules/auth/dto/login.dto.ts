import { PickType } from '@nestjs/mapped-types';
import { ICreateUserDto, LoginUserDto } from 'arli_schema';

export class LoginUserDTO
	extends PickType(ICreateUserDto, ['password', 'email'])
	implements LoginUserDto {}
