import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({ description: "ID of user to reset password" })
    @IsNotEmpty()
    @IsString()
    userId: string;

    @ApiProperty({ description: "New password" })
    @IsNotEmpty()
    @Length(6, 30)
    @IsString()
    newPassword: string;

    @ApiProperty({ description: "Password reset token" })
    @IsNotEmpty()
    @IsString()
    token: string;
}
