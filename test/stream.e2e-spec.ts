import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('StreamController (e2e)', () => {
	let app: INestApplication;
	let server: any;

	// Токен, отриманий після реєстрації/логіну
	let token: string;

	// Ідентифікатор створеного користувача (щоб можна було прив’язати стрім)
	let userId: string;

	// Ідентифікатор створеного стріму
	let streamId: string;

	beforeAll(async () => {
		// Створюємо тестовий модуль на основі вашого AppModule
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();

		// Включимо ValidationPipe для коректної валідації, як у продакшені
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
			}),
		);

		await app.init();
		server = app.getHttpServer();

		// 1. Створюємо нового користувача і отримуємо токен
		// Припустимо, у нас є ендпоінт POST /auth/register,
		// який повертає { message, access_token }
		const regRes = await request(server)
			.post('/auth/register')
			.send({
				username: 'stream_tester',
				email: 'stream_tester@example.com',
				password: 'secret123',
			})
			.expect(201);

		token = regRes.body.access_token.access_token
			? regRes.body.access_token.access_token
			: regRes.body.access_token;
		// Залежно від того, як саме ви повертаєте токен

		// 2. Нам треба дізнатися userId для створення стріму
		// Якщо /auth/register одразу повертає користувача — можна його взяти звідти.
		// Якщо ні, можна викликати /users/:id чи /users?search=...
		// Для прикладу припустимо, що у вас є ендпоінт GET /users, а новостворений — останній або шукаємо за email
		const usersRes = await request(server)
			.get('/users')
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		// знайдемо нашого користувача stream_tester
		const foundUser = usersRes.body.find(
			(u: any) => u.email === 'stream_tester@example.com',
		);
		userId = foundUser?.id;
	});

	afterAll(async () => {
		await app.close();
	});

	describe('Create Stream (POST /streams)', () => {
		it('should create a stream', async () => {
			const createRes = await request(server)
				.post('/streams')
				.set('Authorization', `Bearer ${token}`) // якщо ваш ендпоінт захищений
				.send({
					title: 'My E2E Stream',
					description: 'Testing the creation of a stream',
					// streamKey не передаємо, якщо генерується на бекенді
					userId: userId, // обов’язковий зв’язок
				})
				.expect(201);

			expect(createRes.body).toHaveProperty('id');
			expect(createRes.body.title).toBe('My E2E Stream');
			streamId = createRes.body.id;
		});

		it('should fail with 400 if title is missing', async () => {
			await request(server)
				.post('/streams')
				.set('Authorization', `Bearer ${token}`)
				.send({
					// no title
					userId: userId,
				})
				.expect(400);
		});
	});

	describe('Get Streams (GET /streams)', () => {
		it('should return array of streams', async () => {
			const res = await request(server)
				.get('/streams')
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(Array.isArray(res.body)).toBe(true);
		});
	});

	describe('Get One Stream (GET /streams/:id)', () => {
		it('should return the specific stream', async () => {
			const res = await request(server)
				.get(`/streams/${streamId}`)
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			expect(res.body.id).toBe(streamId);
			expect(res.body.title).toBe('My E2E Stream');
		});

		it('should return 404 if stream not found', async () => {
			await request(server)
				.get(`/streams/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee`) // неіснуючий UUID
				.set('Authorization', `Bearer ${token}`)
				.expect(404);
		});
	});

	describe('Update Stream (PATCH /streams/:id)', () => {
		it('should update the stream title', async () => {
			const updateRes = await request(server)
				.patch(`/streams/${streamId}`)
				.set('Authorization', `Bearer ${token}`)
				.send({
					title: 'Updated E2E Stream Title',
					isLive: true,
				})
				.expect(200);

			expect(updateRes.body.title).toBe('Updated E2E Stream Title');
			expect(updateRes.body.isLive).toBe(true);
		});
	});

	describe('Delete Stream (DELETE /streams/:id)', () => {
		it('should delete the stream', async () => {
			await request(server)
				.delete(`/streams/${streamId}`)
				.set('Authorization', `Bearer ${token}`)
				.expect(200);

			// Перевіримо, що при повторному запиті отримуємо 404
			await request(server)
				.get(`/streams/${streamId}`)
				.set('Authorization', `Bearer ${token}`)
				.expect(404);
		});
	});
});
