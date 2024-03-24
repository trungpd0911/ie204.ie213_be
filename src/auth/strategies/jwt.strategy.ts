import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // ignoreExpiration: false mean that the token will be expired after the expiration time in the payload
            secretOrKey: process.env.JWT_SECRET
        });
    }

    validate(payload: any) {
        // console.log(payload);
        return payload;
    }
}