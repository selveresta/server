import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

describe('UserController (e2e)', () => {
	let app: INestApplication;
	let server: any;
	let token: string;
	let createdUserId: string;

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

		// Отримаємо токен через /auth/login або /auth/register (якщо ендпоінт вимагає авторизацію)
		const registerRes = await request(server).post('/auth/register').send({
			username: 'usercrud',
			email: 'usercrud@test.com',
			password: 'secret123',
		});
		token = registerRes.body.access_token;
	});

	afterAll(async () => {
		await app.close();
	});

	it('GET /users (should return array)', async () => {
		const res = await request(server)
			.get('/users')
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(Array.isArray(res.body)).toBe(true);
	});

	it('POST /users (create new user) - if it’s open route', async () => {
		const createRes = await request(server)
			.post('/users')
			.send({
				username: 'CreatedByTest',
				email: 'createdbytest@example.com',
				password: 'secret123',
			})
			.expect(201);

		// Збережемо ID для подальших тестів
		createdUserId = createRes.body.id;
		expect(createRes.body.email).toBe('createdbytest@example.com');
	});

	it('GET /users/:id (return user info)', async () => {
		const res = await request(server)
			.get(`/users/${createdUserId}`)
			.expect(200);

		expect(res.body.id).toBe(createdUserId);
	});

	it('PATCH /users/:id (update user)', async () => {
		const updateRes = await request(server)
			.patch(`/users/${createdUserId}`)
			.send({
				username: 'UpdatedUsername',
			})
			.expect(200);

		expect(updateRes.body.username).toBe('UpdatedUsername');
	});

	it('DELETE /users/:id (delete user)', async () => {
		await request(server).delete(`/users/${createdUserId}`).expect(200);
	});
});
