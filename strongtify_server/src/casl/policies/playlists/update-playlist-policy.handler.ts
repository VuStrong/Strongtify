import { Inject } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { subject } from "@casl/ability";
import { AppAbility } from "src/casl/casl-ability.factory";
import { PolicyHandler } from "../policy-handler.interface";
import { Action } from "src/casl/enums/casl.enum";

export class UpdatePlaylistHandler implements PolicyHandler {
    constructor(@Inject(REQUEST) private readonly request: Request) {}

    handle(ability: AppAbility): boolean {
        if (!this.request["playlist"]) return false;
        return ability.can(
            Action.Update,
            subject("Playlist", this.request["playlist"]),
        );
    }
}
