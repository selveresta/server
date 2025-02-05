import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeConfigService } from '@C/sequelizeConfig.service';
import { Config } from '@C/configuration';
import { UserModule } from '@M/entity/user/user.module';

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
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
