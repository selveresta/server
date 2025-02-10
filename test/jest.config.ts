import * as path from 'path';
import { JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from '../tsconfig.json';

const config: JestConfigWithTsJest = {
	// 1) Явно встановлюємо rootDir, щоб <rootDir> = my-project/
	rootDir: path.join(__dirname, '..'),

	// 2) Кажемо, де шукати тести (і файли з кодом, якщо треба)
	// Тут можна прописати і одну теку, але зазвичай включають і test/, і src/.
	roots: ['<rootDir>/test', '<rootDir>/src'],

	// 3) Шукаємо усі .spec.ts та .e2e-spec.ts, чи будь-який інший патерн
	testMatch: ['**/*.spec.ts', '**/*.e2e-spec.ts'],

	// 4) Дозволяємо Jest працювати з TypeScript через ts-jest
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},

	// 5) Куди складати репорт покриття (опційно)
	coverageDirectory: 'coverage',

	// 6) Для NestJS-проєкту зазвичай середовище = 'node'
	testEnvironment: 'node',

	// 7) Налаштування для alias'ів: автоматично зчитуємо з tsconfig.json
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		// оскільки rootDir = my-project/, то prefix: '<rootDir>/' перетворює
		// @C/xxx -> my-project/src/config/xxx
		prefix: '<rootDir>/',
	}),
};

export default config;
