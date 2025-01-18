import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { StreamModule } from './modules/stream/stream.module';
import { DatabaseModule } from './src/modules/database/database.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
	imports: [UserModule, StreamModule, DatabaseModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
