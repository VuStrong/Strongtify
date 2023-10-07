import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { MapperService } from "../../../common/utils/mapper.service";

export class AddSongsDto {
    @ApiProperty()
    @Transform(({ value }) => MapperService.mapArray(value))
    @IsArray()
    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    songIds: string[];
}
