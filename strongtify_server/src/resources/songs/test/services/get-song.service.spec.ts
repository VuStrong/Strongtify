import { Test } from "@nestjs/testing";
import { GetSongServiceImpl } from "../../services/get-song.service";
import { DatabaseModule } from "src/database/database.module";
import { GetSongService } from "../../interfaces/get-song-service.interface";
import { ArrayService } from "src/common/utils/array.service";
import { SongNotFoundException } from "../../exceptions/song-not-found.exception";

describe("GetSongService", () => {
    let getSongService: GetSongService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [GetSongServiceImpl, ArrayService],
        }).compile();

        getSongService = moduleRef.get<GetSongService>(GetSongServiceImpl);
    });

    describe("findByIdWithDetails", () => {
        it("should return a song with details", async () => {
            expect(
                await getSongService.findByIdWithDetails(
                    "clljih5fp0004vr1gt0azo0b3",
                ),
            ).toMatchObject({
                id: "clljih5fp0004vr1gt0azo0b3",
                artists: [
                    { id: "clkbdmhen0002vr94bkmaese7" },
                    { id: "clljigj8m0003vr1gdioiiqi4" },
                ],
                genres: [
                    { id: "clkc8ndmy0003vr9wlzw999ku" },
                    { id: "cllj3ucnm0003vrm8zwfto17s" },
                    { id: "cllji2ow70002vr1ggj82lcj2" },
                ],
            });
        });

        test("should throw SongNotFoundException", () => {
            expect(
                async () => await getSongService.findByIdWithDetails("1"),
            ).rejects.toThrow(SongNotFoundException);
        });
    });
});
