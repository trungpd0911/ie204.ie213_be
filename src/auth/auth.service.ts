import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { LoginUserDto } from './dto/loginUser.dto';
import { RegisterUserDto } from './dto/registerUser.dto';
import * as bcrypt from 'bcrypt';
import { responseData } from 'src/global/globalClass';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
    ) { }

    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        return hash;
    }

    async register(registerUser: RegisterUserDto) {
        try {
            const { email, password, username } = registerUser;
            const checkUserExist = await this.userModel.findOne({ email: email });
            if (checkUserExist) {
                throw new HttpException('User already exist', 400);
            }
            const hash = await this.hashPassword(password);
            const newUser = new this.userModel({ email, password: hash, username });
            await newUser.save();
            return new responseData(null, 200, "User created successfully");
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            console.log(error);
            throw new HttpException('Internal server error', 500);
        }
    }

    async login(loginUser: LoginUserDto) {
        try {
            const checkUser = await this.userModel.findOne({
                email: loginUser.email
            })
            if (!checkUser) {
                throw new UnauthorizedException('wrong email or password');
            }
            const checkPassword = bcrypt.compareSync(loginUser.password, checkUser.password);
            if (!checkPassword) {
                throw new UnauthorizedException('wrong email or password');
            }
            const { password, ...user } = checkUser.toObject();
            const token = this.jwtService.sign(user);
            return new responseData({ token }, 200, "Login successfully");
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            console.log(error);
            throw new HttpException('Internal server error', 500);
        }
    }
}
