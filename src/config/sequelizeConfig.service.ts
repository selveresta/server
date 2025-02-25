import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	SequelizeModuleOptions,
	SequelizeOptionsFactory,
} from '@nestjs/sequelize';
import { IConfig } from 'arli_schema';

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
	constructor(private readonly configService: ConfigService) {}

	createSequelizeOptions(): SequelizeModuleOptions {
		const {
			sql: {
				dialect,
				host,
				port,
				username,
				password,
				database,
				autoLoadEntities,
				synchronize,
			},
		} = this.configService.get<IConfig>('config');

		return {
			dialect,
			host,
			port,
			username,
			password,
			database,
			models: [],
			synchronize: synchronize ?? true,
			autoLoadModels: autoLoadEntities,
			define: {
				charset: 'utf8',
				collate: 'utf8_general_ci',
			},
		};
	}
}
