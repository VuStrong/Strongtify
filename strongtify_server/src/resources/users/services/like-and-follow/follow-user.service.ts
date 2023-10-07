import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { FollowUserService } from "../../interfaces/like-and-follow/follow-user-service.interface";
import { PrismaService } from "src/database/prisma.service";
import { UserNotFoundException } from "../../exceptions/user-not-found.exception";
import { PagingParamDto } from "src/common/dtos/paging-param.dto";
import { UserResponseDto } from "../../dtos/get/user-response.dto";
import { PagedResponseDto } from "src/common/dtos/paged-response.dto";
import { USER_SERVICES } from "../../interfaces/constants";
import { CudUserService } from "../../interfaces/cud-user-service.interface";

@Injectable()
export class FollowUserServiceImpl implements FollowUserService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(USER_SERVICES.CudUserService)
        private readonly cudUserService: CudUserService,
    ) {}

    async getFollowingUsers(
        userId: string,
        pagingParams: PagingParamDto,
    ): Promise<PagedResponseDto<UserResponseDto>> {
        const { skip, take, allowCount } = pagingParams;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                followings: { skip, take },
                _count: allowCount && {
                    select: { followings: true },
                },
            },
        });

        if (!user) throw new UserNotFoundException();

        return new PagedResponseDto<UserResponseDto>(
            user.followings,
            skip,
            take,
            user._count?.followings ?? 0,
        );
    }

    async getFollowers(
        userId: string,
        pagingParams: PagingParamDto,
    ): Promise<PagedResponseDto<UserResponseDto>> {
        const { skip, take, allowCount } = pagingParams;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                followers: { skip, take },
                _count: allowCount && {
                    select: { followers: true },
                },
            },
        });

        if (!user) throw new UserNotFoundException();

        return new PagedResponseDto<UserResponseDto>(
            user.followers,
            skip,
            take,
            user._count?.followers ?? 0,
        );
    }

    async followUser(userId: string, idToFollow: string): Promise<boolean> {
        if (!userId || !idToFollow)
            throw new BadRequestException(
                "userId or idToFollow should not empty",
            );

        const isFollowing = await this.checkFollowingUser(userId, idToFollow);

        if (isFollowing) return;

        await this.cudUserService.update({
            data: {
                followers: {
                    connect: { id: userId },
                },
                followerCount: { increment: 1 },
            },
            where: { id: idToFollow },
        });

        return true;
    }

    async unFollowUser(userId: string, idToUnFollow: string): Promise<boolean> {
        if (!userId || !idToUnFollow)
            throw new BadRequestException(
                "userId or idToUnFollow should not empty",
            );

        const isFollowing = await this.checkFollowingUser(userId, idToUnFollow);

        if (!isFollowing) return;

        await this.cudUserService.update({
            data: {
                followers: {
                    disconnect: { id: userId },
                },
                followerCount: { decrement: 1 },
            },
            where: { id: idToUnFollow },
        });

        return true;
    }

    async checkFollowingUser(
        userId: string,
        idToCheck: string,
    ): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                _count: {
                    select: {
                        followings: { where: { id: idToCheck } },
                    },
                },
            },
        });

        if (!user) throw new UserNotFoundException();

        return user._count.followings > 0;
    }
}
