import { Injectable } from "@nestjs/common";
import { PureAbility, AbilityBuilder } from "@casl/ability";
import { PrismaQuery, Subjects, createPrismaAbility } from "@casl/prisma";
import {
    User,
    Playlist,
    Role,
    PlaylistStatus,
    Album,
    Artist,
    Genre,
    Song,
} from "@prisma/client";
import { JwtPayload } from "src/auth/types/jwt-payload";
import { Action } from "./enums/casl.enum";

export type AppAbility = PureAbility<
    [
        Action,
        (
            | Subjects<{
                  User: User;
                  Account: User;
                  Playlist: Playlist;
                  Album: Album;
                  Artist: Artist;
                  Genre: Genre;
                  Song: Song;
                  Dashboard: any;
              }>
            | "all"
        ),
    ],
    PrismaQuery
>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: JwtPayload) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(
            createPrismaAbility,
        );

        if (user?.role === Role.ADMIN) {
            can(Action.Manage, "all");
            can(Action.Read, "Dashboard");

            cannot(Action.Update, "Account", { role: Role.ADMIN });
            cannot(Action.Delete, "Account", { role: Role.ADMIN });
        } else if (user?.role === Role.MEMBER) {
            can(Action.Read, "Playlist", {
                OR: [{ status: PlaylistStatus.PUBLIC }, { userId: user.sub }],
            });

            can(Action.Update, "Playlist", { userId: user.sub });
            can(Action.Delete, "Playlist", { userId: user.sub });
        } else if (!user) {
            can(Action.Read, "Playlist", {
                status: PlaylistStatus.PUBLIC,
            });
        }

        return build();
    }
}
