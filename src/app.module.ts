import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { ProfileModule } from './modules/profile/profile.module';

import { Config } from '@C/configuration';
import { SequelizeConfigService } from '@C/sequelizeConfig.service';
import { AuthModule } from '@M/auth/auth.module';
import { JwtStrategy } from '@M/auth/jwt/jwt.strategy';
import { StreamModule } from '@M/entity/stream/stream.module';
import { UserModule } from '@M/entity/user/user.module';
import { ExceptionModule } from '@M/exception/exception.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [Config],
			isGlobal: true,
		}),
		SequelizeModule.forRootAsync({
			imports: [ConfigModule],
			useClass: SequelizeConfigService,
		}),
		UserModule,
		StreamModule,
		AuthModule,
		ProfileModule,
		ExceptionModule,
	],
	controllers: [],
	providers: [JwtStrategy],
})
export class AppModule {}
