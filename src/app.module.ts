import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeConfigService } from '@C/sequelizeConfig.service';
import { Config } from '@C/configuration';
import { StreamModule } from '@M/entity/stream/stream.module';
import { UserModule } from '@M/entity/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [Config],
		}),
		SequelizeModule.forRootAsync({
			imports: [ConfigModule],
			useClass: SequelizeConfigService,
		}),
		UserModule,
		StreamModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
