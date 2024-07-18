import { Provider } from "@nestjs/common";
import { ReadAdminDashboardHandler } from "../policies/read-admin-dashboard-policy.handler";

export const ReadAdminDashboardPolicyProvider: Provider = ReadAdminDashboardHandler;
