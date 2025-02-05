import { Module } from '@nestjs/common';
import { StreamService } from './stream.service';
import { StreamController } from './stream.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Stream } from '@M/entity/stream/stream.model';

@Module({
	imports: [SequelizeModule.forFeature([Stream])],
	providers: [StreamService],
	controllers: [StreamController],
})
export class StreamModule {}
