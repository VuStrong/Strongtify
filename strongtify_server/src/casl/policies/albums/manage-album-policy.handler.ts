import { AppAbility } from "src/casl/casl-ability.factory";
import { PolicyHandler } from "../policy-handler.interface";
import { Action } from "src/casl/enums/casl.enum";

export class ManageAlbumHandler implements PolicyHandler {
    handle(ability: AppAbility): boolean {
        return ability.can(Action.Manage, "Album");
    }
}
