import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class SendPasswordResetDto {
    @ApiProperty()
    @IsEmail()
    email: string;
}
