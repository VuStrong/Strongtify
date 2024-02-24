import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { FollowArtistService } from "../../interfaces/like-and-follow/follow-artist-service.interface";
import { PrismaService } from "src/database/prisma.service";
import { ArtistNotFoundException } from "src/resources/artists/exceptions/artist-not-found.exception";
import { PrismaError } from "src/database/enums/prisma-error.enum";
import { QueryParamDto } from "src/common/dtos/query-param.dto";
import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { ArtistResponseDto } from "src/resources/artists/dtos/get/artist-response.dto";
import { UserNotFoundException } from "../../exceptions/user-not-found.exception";

@Injectable()
export class FollowArtistServiceImpl implements FollowArtistService {
    constructor(private readonly prisma: PrismaService) {}

    async getFollowingArtists(
        userId: string,
        params: QueryParamDto,
    ): Promise<PagedResponseDto<ArtistResponseDto>> {
        const { skip, take, allowCount } = params;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                followingArtists: {
                    select: { artist: true },
                    orderBy: { followAt: "desc" },
                    skip,
                    take,
                },
                _count: allowCount && {
                    select: { followingArtists: true },
                },
            },
        });

        if (!user) throw new UserNotFoundException();

        return new PagedResponseDto<ArtistResponseDto>(
            user.followingArtists.map((a) => a.artist),
            skip,
            take,
            user._count?.followingArtists ?? 0,
        );
    }

    async followArtist(userId: string, artistId: string): Promise<boolean> {
        if (!userId || !artistId)
            throw new BadRequestException(
                "userId or artistId should not empty",
            );

        await this.prisma
            .$transaction([
                this.prisma.userArtist.create({
                    data: {
                        user: { connect: { id: userId } },
                        artist: { connect: { id: artistId } },
                    },
                }),
                this.prisma.artist.update({
                    where: { id: artistId },
                    data: { followerCount: { increment: 1 } },
                }),
            ])
            .catch((error) => {
                if (
                    error?.code === PrismaError.ENTITY_NOT_FOUND ||
                    error?.code === PrismaError.QUERY_INTERPRETATION_ERROR
                ) {
                    throw new ArtistNotFoundException();
                } else if (
                    error?.code === PrismaError.UNIQUE_CONSTRAINT_FAILED
                ) {
                } else {
                    throw new InternalServerErrorException();
                }
            });

        return true;
    }

    async unFollowArtist(userId: string, artistId: string): Promise<boolean> {
        if (!userId || !artistId)
            throw new BadRequestException(
                "userId or artistId should not empty",
            );

        await this.prisma
            .$transaction([
                this.prisma.userArtist.delete({
                    where: {
                        userId_artistId: { userId, artistId },
                    },
                }),
                this.prisma.artist.update({
                    where: { id: artistId },
                    data: { followerCount: { decrement: 1 } },
                }),
            ])
            .catch((error) => {
                if (
                    error?.code === PrismaError.ENTITY_NOT_FOUND ||
                    error?.code === PrismaError.QUERY_INTERPRETATION_ERROR
                ) {
                    
                } else {
                    throw new InternalServerErrorException();
                }
            });

        return true;
    }

    async checkFollowingArtist(
        userId: string,
        artistId: string,
    ): Promise<boolean> {
        try {
            await this.prisma.userArtist.findUniqueOrThrow({
                where: { userId_artistId: { userId, artistId } },
            });

            return true;
        } catch (error) {
            return false;
        }
    }

    async getAllFollowingArtistIds(userId: string): Promise<string[]> {
        const data = await this.prisma.userArtist.findMany({
            where: {
                userId,
            },
            select: {
                artistId: true,
            }
        });

        return data.map(d => d.artistId);
    }
}
