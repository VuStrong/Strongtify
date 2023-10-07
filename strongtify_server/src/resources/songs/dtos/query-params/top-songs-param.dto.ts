import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export enum Time {
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
}

export class TopSongsParamDto {
    @ApiProperty({ enum: Time })
    @IsEnum(Time)
    time: Time;
}
