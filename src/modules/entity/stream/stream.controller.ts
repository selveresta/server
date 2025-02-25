import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { ICreateStreamDto, IUpdateStreamDto } from 'arli_schema';

import { StreamService } from './stream.service';

@Controller('streams')
export class StreamController {
	constructor(private readonly streamService: StreamService) {}

	@Post()
	create(@Body() createStreamDto: ICreateStreamDto) {
		return this.streamService.create(createStreamDto);
	}

	@Get()
	findAll() {
		return this.streamService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.streamService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateStreamDto: IUpdateStreamDto) {
		return this.streamService.update(id, updateStreamDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.streamService.remove(id);
	}
}
