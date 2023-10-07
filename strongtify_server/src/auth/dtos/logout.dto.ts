import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LogoutDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}
