import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from 'arli_schema';

import { AuthService } from './auth.service';

import { UserService } from '@M/entity/user/user.service';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: UserService,
	) {}

	@Post('login')
	async login(@Body() loginUserDTO: LoginUserDto) {
		const user = await this.authService.validateUser(
			loginUserDTO.email,
			loginUserDTO.password,
		);
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}
		return this.authService.login(user);
	}

	@Post('register')
	async register(@Body() registerUserDto: RegisterUserDto) {
		const newUser = await this.userService.create(registerUserDto);

		const accessToken = this.authService.login({
			id: newUser.id,
			email: newUser.email,
		});
		return {
			message: 'Registration success',
			accessToken,
		};
	}
}
