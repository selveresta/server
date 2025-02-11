import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		ignores: ['dist/*', 'eslint.config.mjs'],
	},
	...compat.extends(
		'plugin:eslint-config-arli/recommended',
		'plugin:import/typescript',
	),
	{
		languageOptions: {
			ecmaVersion: 6,
			sourceType: 'script',
			parserOptions: {
				project: './tsconfig.eslint.json',
			},
		},
	},
];
