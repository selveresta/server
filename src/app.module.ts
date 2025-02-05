import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Config } from '@C/configuration';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [Config],
		}),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
