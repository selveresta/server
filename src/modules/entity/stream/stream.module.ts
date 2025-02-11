import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';

import { Stream } from '@M/entity/stream/stream.model';

@Module({
	imports: [SequelizeModule.forFeature([Stream])],
	providers: [StreamService],
	controllers: [StreamController],
})
export class StreamModule {}
