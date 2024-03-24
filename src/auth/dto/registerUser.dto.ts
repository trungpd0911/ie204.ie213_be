import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    // set contains at least one letter 
    @Matches(/^(?=.*[A-Za-z]).+$/, {
        message: 'Password must contain at least one letter',
    })
    password: string;
}