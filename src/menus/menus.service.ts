import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { responseData } from 'src/global/globalClass';
import { Menu } from 'src/schemas/Menu.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MenusService {
	constructor(@InjectModel(Menu.name) private menuModel: Model<Menu>) {}

	async getAllMenus() {
		try {
			const menus = await this.menuModel.find();

			if (menus.length == 0) {
				throw new NotFoundException('No menu found');
			}
			return new responseData(menus, 200, 'Get all menus successfully');
		} catch (e) {
			throw new HttpException(e, 500);
		}
	}
}
