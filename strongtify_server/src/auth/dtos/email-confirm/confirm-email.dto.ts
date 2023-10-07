import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmEmailDto {
    @ApiProperty({ description: "ID of user to confirm email" })
    @IsNotEmpty()
    @IsString()
    userId: string;

    @ApiProperty({ description: "Confirm email token" })
    @IsNotEmpty()
    @IsString()
    token: string;
}
