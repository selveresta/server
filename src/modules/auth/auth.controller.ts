import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@M/entity/user/dto/create-user.dto';
import { UserService } from '@M/entity/user/user.service';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: UserService,
	) {}

	@Post('login')
	async login(
		@Body() { email, password }: { email: string; password: string },
	) {
		const user = await this.authService.validateUser(email, password);
		return this.authService.login({ id: user.id, email: user.email });
	}

	@Post('register')
	async register(@Body() createUserDto: CreateUserDto) {
		const newUser = await this.userService.create(createUserDto);

		const accessToken = this.authService.login({
			id: newUser.id,
			email: newUser.email,
		});
		return {
			message: 'Registration success',
			access_token: accessToken,
		};
	}
}
