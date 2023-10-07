import { Exclude, Expose } from "class-transformer";
import { SongResponseDto } from "./song-response.dto";
import { ApiProperty } from "@nestjs/swagger";

@Exclude()
export class TopSongResponseDto extends SongResponseDto {
    @ApiProperty()
    @Expose()
    listenCountInTimeRange: number;
}
