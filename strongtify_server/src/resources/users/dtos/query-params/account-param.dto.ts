import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { Expose, Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { QueryParamDto } from "src/common/dtos/query-param.dto";
import { MapperService } from "src/common/utils/mapper.service";

export class AccountParamDto extends QueryParamDto {
    @ApiProperty({ required: false })
    @Transform(({ value }) => MapperService.mapBool(value))
    @IsBoolean()
    @IsOptional()
    @Expose()
    locked?: boolean;

    @ApiProperty({ required: false })
    @Transform(({ value }) => MapperService.mapBool(value))
    @IsBoolean()
    @IsOptional()
    @Expose()
    emailConfirmed?: boolean;

    @ApiProperty({
        enum: Role,
        required: false,
    })
    @IsEnum(Role)
    @IsOptional()
    @Expose()
    role?: Role;
}
