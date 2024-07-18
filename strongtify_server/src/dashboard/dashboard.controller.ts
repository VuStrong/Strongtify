import { Controller, Get, UseGuards, UseInterceptors } from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
import { DashboardService } from "./dashboard.service";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { PoliciesGuard } from "src/casl/guards/policies.guard";
import { CheckPolicies } from "src/casl/decorators/check-policies.decorator";
import { AdminWebStatDto } from "./dtos/admin-web-stat.dto";
import { ACCESS_TOKEN } from "src/auth/constants";
import { ReadAdminDashboardHandler } from "src/casl/policies/read-admin-dashboard-policy.handler";
import { TransformDataInterceptor } from "src/common/interceptors/transform-data.interceptor";

@ApiTags("dashboard")
@Controller({
    path: "dashboard",
    version: "1",
})
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @ApiOperation({ summary: "Get dashboard stats for web" })
    @ApiOkResponse({ type: AdminWebStatDto })
    @ApiBearerAuth(ACCESS_TOKEN)
    @Get("web")
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies(ReadAdminDashboardHandler)
    @UseInterceptors(new TransformDataInterceptor(AdminWebStatDto))
    async webStat() {
        return this.dashboardService.getAdminWebStat();
    }
}
