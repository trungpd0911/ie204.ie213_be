import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary';
import { CloudinaryController } from './cloudinary.controller';

@Module({
	controllers: [CloudinaryController],
	providers: [CloudinaryService, CloudinaryProvider],
	exports: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
