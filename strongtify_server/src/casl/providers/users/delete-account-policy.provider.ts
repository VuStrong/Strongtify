import { Provider } from "@nestjs/common";
import { DeleteAccountHandler } from "src/casl/policies/users/delete-account-policy.handler";

export const DeleteAccountPolicyProvider: Provider = DeleteAccountHandler;
