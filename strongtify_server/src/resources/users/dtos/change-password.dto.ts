import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(6, 30)
    @IsString()
    oldPassword: string;

    @ApiProperty()
    @IsNotEmpty()
    @Length(6, 30)
    @IsString()
    newPassword: string;
}
