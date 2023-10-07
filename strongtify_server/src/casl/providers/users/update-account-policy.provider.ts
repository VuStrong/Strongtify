import { Provider } from "@nestjs/common";
import { UpdateAccountHandler } from "src/casl/policies/users/update-account-policy.handler";

export const UpdateAccountPolicyProvider: Provider = UpdateAccountHandler;
