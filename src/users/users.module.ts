import { Global, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/User.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Global()
@Module({
	imports: [
		CloudinaryModule,
		MongooseModule.forFeature([
			{
				name: User.name,
				schema: UserSchema,
			},
		]),
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule { }
