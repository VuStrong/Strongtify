import { SetMetadata, Type } from "@nestjs/common";
import { PolicyHandler } from "../policies/policy-handler.interface";

export const CHECK_POLICIES_KEY = "checkpolicy";
export const CheckPolicies = (...handlers: Type<PolicyHandler>[]) =>
    SetMetadata(CHECK_POLICIES_KEY, handlers);
