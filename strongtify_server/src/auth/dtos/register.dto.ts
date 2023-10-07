import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class RegisterDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(1, 30)
    @IsString()
    name: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @Length(6, 30)
    @IsString()
    password: string;
}
