import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IUpdateUserDto } from '@T/user/dto/user.dto';

export class UpdateUserDto
	extends PartialType(CreateUserDto)
	implements IUpdateUserDto {}
