import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private roles: string[]) { }
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const hasRole = this.roles.includes(request.currentUser.role);
		if (!hasRole) {
			throw new ForbiddenException('Permission denied');
		}
		return true;
	}
}
