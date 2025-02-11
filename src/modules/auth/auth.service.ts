import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '@M/entity/user/user.service';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
	) {}

	/**
	 * Перевіряє email/пароль
	 * - Якщо коректні, повертає дані користувача
	 * - Якщо ні – кидає помилку UnauthorizedException
	 */
	async validateUser(email: string, pass: string) {
		// Знаходимо користувача за email
		const user = await this.userService.findBy('email', email);
		// Якщо не знайдено, findByEmail кине NotFoundException або поверне null
		// Якщо у вас не кидається помилка, перевірте тут:
		// if (!user) throw new UnauthorizedException('User not found');

		// Порівнюємо хеш паролю з bcrypt
		const isMatch = await bcrypt.compare(pass, user.password);
		if (!isMatch) {
			throw new UnauthorizedException('Wrong credentials');
		}

		// Приховуємо пароль перед поверненням

		const { password, ...rest } = user.get({ plain: true });
		return rest;
	}

	/**
	 * Генерує JWT
	 */
	login(payload: { id: string; email: string }) {
		// Формуємо payload
		return {
			accessToken: this.jwtService.sign({
				sub: payload.id,
				email: payload.email,
			}),
		};
	}
}
