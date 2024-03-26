import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private configService: ConfigService,
		private jwtService: JwtService,
	) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		try {
			const token = request.headers.authorization.split(' ')[1];

			if (!token) {
				throw new ForbiddenException('Token not found');
			}

			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get<string>('JWT_SECRET'),
			});
			request.currentUser = payload;
		} catch (error) {
			throw new ForbiddenException('Invalid token or expired');
		}
		return true;
	}
}
