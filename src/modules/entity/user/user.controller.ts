import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { ICreateUserDto, IUpdateUserDto } from 'arli_schema';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	create(@Body() createUserDto: ICreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: IUpdateUserDto) {
		return this.userService.update(id, updateUserDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(id);
	}
}
