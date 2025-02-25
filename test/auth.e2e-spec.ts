import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
	let app: INestApplication;
	let server: any;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
			}),
		);
		await app.init();
		server = app.getHttpServer();
	});

	afterAll(async () => {
		await app.close();
	});

	describe('/auth/register (POST)', () => {
		it('should register a user', async () => {
			const response = await request(server).post('/auth/register').send({
				username: 'e2e_tester',
				email: 'e2e@test.com',
				password: 'secret123',
			});

			if (response.status === 201) {
				expect(response.status).toBe(201);
				expect(response.body).toHaveProperty('message', 'Registration success');
				expect(response.body).toHaveProperty('accessToken');
			} else {
				expect(response.status).toBe(409);
			}
		});

		it('should return 400 if email is invalid', async () => {
			const response = await request(server)
				.post('/auth/register')
				.send({
					username: 'e2e_invalid',
					email: 'not_an_email',
					password: 'secret123',
				})
				.expect(400);

			expect(response.body.message).toContain('email must be an email');
		});
	});

	describe('/auth/login (POST)', () => {
		it('should login and return accessToken', async () => {
			// Припустимо, у нас уже є користувач e2e@test.com
			// Або реєструємо знову
			const loginRes = await request(server)
				.post('/auth/login')
				.send({
					email: 'e2e@test.com',
					password: 'secret123',
				})
				.expect(201);

			expect(loginRes.body).toHaveProperty('accessToken');
		});

		it('should return 401 if password is wrong', async () => {
			const loginRes = await request(server)
				.post('/auth/login')
				.send({
					email: 'e2e@test.com',
					password: 'wrongpass',
				})
				.expect(401);

			expect(loginRes.body.message).toBe('Wrong credentials');
		});
	});
});
