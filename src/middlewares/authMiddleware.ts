import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JsonWebTokenError, JwtService } from "@nestjs/jwt";
import { NextFunction, Request } from "express";

@Injectable()
export class AdminMiddleware implements NestMiddleware {
    constructor(
        private jwtService: JwtService
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new UnauthorizedException('Token is required');
            }
            const token = authHeader.split(' ')[1];
            const user = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
            if (!user.isAdmin) {
                throw new UnauthorizedException("you don't have permission to access this route");
            }
            req.user = user;
            next();
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            if (error instanceof JsonWebTokenError) {
                throw new UnauthorizedException('Invalid token');
            }
            console.log(error);
            throw new UnauthorizedException('Invalid token');
        }
    }
}