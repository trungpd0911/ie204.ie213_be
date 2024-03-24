import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LoginUserDto } from './dto/loginUser.dto';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { JwtAuthGuard } from './guards/jwt.guards';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @Post('/register')
    async register(@Body() registerUser: RegisterUserDto) {
        return this.authService.register(registerUser);
    }

    @Post('/login')
    // @UseGuards(LocalGuard)
    async login(@Body() loginUser: LoginUserDto) {
        return this.authService.login(loginUser);
    }


    @Get('status')
    @UseGuards(JwtAuthGuard)
    status(@Req() req: Request) {
        console.log(req.user);
        return req.user;
        // return req.user;
    }


}
