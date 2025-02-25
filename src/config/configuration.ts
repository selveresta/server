import { registerAs } from '@nestjs/config';
import { IConfig } from 'arli_schema';

import { serverConfig } from '@C/configs/server.config';
import { sqlConfig } from '@C/configs/sql.config';

export const Config = registerAs<IConfig>('config', () => ({
	sql: sqlConfig(),
	server: serverConfig(),
}));
