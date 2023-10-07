import {
    Injectable,
    CanActivate,
    ExecutionContext,
    Type,
    Scope,
} from "@nestjs/common";
import { ContextIdFactory, ModuleRef, Reflector } from "@nestjs/core";
import { CaslAbilityFactory } from "../casl-ability.factory";
import { CHECK_POLICIES_KEY } from "../decorators/check-policies.decorator";
import { PolicyHandler } from "../policies/policy-handler.interface";

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(
        private caslAbilityFactory: CaslAbilityFactory,
        private reflector: Reflector,
        private moduleRef: ModuleRef,
    ) {}

    async canActivate(ctx: ExecutionContext) {
        const policiesHandlersRef =
            this.reflector.get<Type<PolicyHandler>[]>(
                CHECK_POLICIES_KEY,
                ctx.getHandler(),
            ) || [];

        const policiesHandlersRefLength = policiesHandlersRef.length;
        if (policiesHandlersRefLength === 0) return true;

        const contextId = ContextIdFactory.create();
        this.moduleRef.registerRequestByContextId(
            ctx.switchToHttp().getRequest(),
            contextId,
        );

        const policyHandlers: PolicyHandler[] = [];
        for (let i = 0; i < policiesHandlersRefLength; i++) {
            const policyHandlerRef = policiesHandlersRef[i];

            const policyScope =
                this.moduleRef.introspect(policyHandlerRef).scope;

            let policyHandler: PolicyHandler;

            if (policyScope === Scope.DEFAULT) {
                policyHandler = this.moduleRef.get(policyHandlerRef, {
                    strict: false,
                });
            } else {
                policyHandler = await this.moduleRef.resolve(
                    policyHandlerRef,
                    contextId,
                    { strict: false },
                );
            }

            policyHandlers.push(policyHandler);
        }

        const { user } = ctx.switchToHttp().getRequest();
        const ability = this.caslAbilityFactory.createForUser(user);

        return policyHandlers.every((handler) => handler.handle(ability));
    }
}
