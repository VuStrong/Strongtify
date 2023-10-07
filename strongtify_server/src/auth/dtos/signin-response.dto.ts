import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { Expose, Transform, plainToInstance } from "class-transformer";
import { AccountResponseDto } from "src/resources/users/dtos/get/account-response.dto";

export class SignInResponseDto {
    @ApiProperty()
    @Expose()
    access_token: string;

    @ApiProperty()
    @Expose()
    refresh_token: string;

    @ApiProperty({ type: AccountResponseDto })
    @Expose()
    @Transform(({ value }) => plainToInstance(AccountResponseDto, value))
    user?: User;
}
