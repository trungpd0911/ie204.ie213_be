import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema } from 'src/schemas/Menu.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Menu.name,
				schema: MenuSchema,
			},
		]),
	],
	controllers: [MenusController],
	providers: [MenusService],
})
export class MenusModule {}
