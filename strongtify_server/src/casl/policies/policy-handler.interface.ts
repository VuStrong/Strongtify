import { AppAbility } from "../casl-ability.factory";

export interface PolicyHandler {
    handle(ability: AppAbility): boolean;
}
