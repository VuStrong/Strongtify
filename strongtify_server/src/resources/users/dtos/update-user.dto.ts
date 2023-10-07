import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";
import { MapperService } from "src/common/utils/mapper.service";

export class UpdateUserDto {
    @ApiProperty({ required: false })
    @Transform(({ value }) => MapperService.mapBool(value))
    @IsBoolean()
    @IsOptional()
    @Expose()
    locked?: boolean;
}
