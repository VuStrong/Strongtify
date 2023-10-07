import { Provider } from "@nestjs/common";
import { ReadAccountHandler } from "src/casl/policies/users/read-account-policy.handler";

export const ReadAccountPolicyProvider: Provider = ReadAccountHandler;
