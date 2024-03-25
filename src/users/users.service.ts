import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) {
    }

    async getAllUsers() {
        const users = await this.userModel.find();
        return users;
    }

    async findByEmail(email: string) {
        const user = await this.userModel.findOne({
            email: email
        });
        return user;
    }
}
