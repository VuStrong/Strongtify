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
        it("should return a song", async () => {
            const id = 'clljih5fp0004vr1gt0azo0b3';
            
            expect(
                (await getSongService.findByIdWithDetails(
                    "clljih5fp0004vr1gt0azo0b3",
                )).id,
            ).toBe(id);
        });

        test("should throw SongNotFoundException", () => {
            expect(
                async () => await getSongService.findByIdWithDetails("1"),
            ).rejects.toThrow(SongNotFoundException);
        });
    });

    describe("get", () => {
        const take = 10;

        it("should return a list of paginated songs", async () => {
            const data = await getSongService.get({
                skip: 0, take,
            });

            expect(data.take).toBe(take);
            expect(data.results.length).toBe(take);
        });

        it("should return a list of songs which language is JAPANESE", async () => {
            const data = await getSongService.get({
                take, language: "JAPANESE",
            });

            expect(data.results.every(song => song.language == "JAPANESE")).toBe(true);
        });
    });
});
