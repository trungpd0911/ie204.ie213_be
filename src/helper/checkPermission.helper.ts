import { BadRequestException } from '@nestjs/common';

export class Permission {
	static checkPermission(paramId: string, currentId: string, role: string) {
		if (currentId === paramId || role === 'admin') return;

		throw new BadRequestException(
			'You do not have permission to access this resource',
		);
	}
}
