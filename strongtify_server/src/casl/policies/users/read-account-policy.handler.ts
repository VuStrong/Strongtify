import { AppAbility } from "src/casl/casl-ability.factory";
import { Action } from "src/casl/enums/casl.enum";
import { PolicyHandler } from "../policy-handler.interface";

export class ReadAccountHandler implements PolicyHandler {
    handle(ability: AppAbility): boolean {
        return ability.can(Action.Read, "Account");
    }
}
