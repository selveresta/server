import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			// Вказуємо, звідки брати токен (з заголовка Authorization)
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			// Секрет – той самий, що у JwtModule.register()
			secretOrKey: process.env.JWT_SECRET || 'test_secret',
		});
	}

	/**
	 * Метод викликається автоматично Passport'ом,
	 * якщо токен валідний: повертає дані, які потрапляють у req.user
	 */
	async validate(payload: any) {
		// Якщо щось не так із payload, можна кинути UnauthorizedException
		if (!payload?.sub) {
			throw new UnauthorizedException('Invalid token');
		}

		// Повертаємо об’єкт, який буде в req.user
		return { userId: payload.sub, email: payload.email };
	}
}
