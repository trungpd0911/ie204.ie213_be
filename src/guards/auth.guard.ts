import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private configService: ConfigService,
		private jwtService: JwtService,
		private userService: UsersService,
	) { }
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		try {
			const token = request.headers.authorization.split(' ')[1];

			if (!token) {
				throw new UnauthorizedException('Invalid token or expired');
			}

			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get<string>('JWT_SECRET'),
			});

			const user = await this.userService.findUserByEmail(payload.email);
			if (!user) {
				throw new UnauthorizedException('User not found');
			}

			request.currentUser = user;
		} catch (error) {
			throw new UnauthorizedException('Invalid token or expired');
		}
		return true;
	}
}
