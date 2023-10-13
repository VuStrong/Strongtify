import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Patch,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";

import { AuthGuard } from "src/auth/guards/auth.guard";
import { ApiPaging } from "src/common/decorators/api/api-paging.decorator";
import { ACCESS_TOKEN } from "src/auth/constants";
import { TransformDataInterceptor } from "src/common/interceptors/transform-data.interceptor";
import { PagingQuery } from "src/common/decorators/paging-query.decorator";
import { AccountParamDto } from "../dtos/query-params/account-param.dto";
import { AccountResponseDto } from "../dtos/get/account-response.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";

import { PoliciesGuard } from "src/casl/guards/policies.guard";
import { CheckPolicies } from "src/casl/decorators/check-policies.decorator";
import { DeleteAccountHandler } from "src/casl/policies/users/delete-account-policy.handler";
import { ReadAccountHandler } from "src/casl/policies/users/read-account-policy.handler";
import { UpdateAccountHandler } from "src/casl/policies/users/update-account-policy.handler";
import { USER_SERVICES } from "../interfaces/constants";
import { GetUserService } from "../interfaces/get-user-service.interface";
import { CudUserService } from "../interfaces/cud-user-service.interface";

@ApiTags("accounts")
@Controller({
    path: "accounts",
    version: "1",
})
@ApiBearerAuth(ACCESS_TOKEN)
@UseGuards(AuthGuard, PoliciesGuard)
@UseInterceptors(new TransformDataInterceptor(AccountResponseDto))
export class AccountsController {
    constructor(
        @Inject(USER_SERVICES.GetUserService)
        private readonly getUserService: GetUserService,
        @Inject(USER_SERVICES.CudUserService)
        private readonly cudUserService: CudUserService,
    ) {}

    @ApiOperation({ summary: "Get accounts (ADMIN REQUIRED)" })
    @ApiPaging(AccountResponseDto, AccountParamDto)
    @Get()
    @CheckPolicies(ReadAccountHandler)
    async getAccounts(
        @PagingQuery(AccountParamDto) accountParams: AccountParamDto,
    ) {
        return this.getUserService.get(accountParams);
    }

    @ApiOperation({ summary: "Get account by ID (ADMIN REQUIRED)" })
    @ApiOkResponse({ type: AccountResponseDto })
    @ApiNotFoundResponse({ description: "User not found" })
    @Get(":id")
    @CheckPolicies(ReadAccountHandler)
    async getAccountById(@Param("id") id: string) {
        return this.getUserService.findById(id);
    }

    @ApiOperation({ summary: "Change account's state (ADMIN REQUIRED)" })
    @ApiOkResponse({ type: AccountResponseDto })
    @ApiNotFoundResponse({ description: "User not found" })
    @Patch(":id")
    @CheckPolicies(UpdateAccountHandler)
    async updateUser(
        @Param("id") id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.cudUserService.update({
            where: { id },
            data: updateUserDto,
        });
    }

    @ApiOperation({ summary: "Delete an account (ADMIN REQUIRED)" })
    @ApiOkResponse({ type: AccountResponseDto })
    @ApiNotFoundResponse({ description: "User not found" })
    @Delete(":id")
    @CheckPolicies(DeleteAccountHandler)
    async deleteAccount(@Param("id") id: string) {
        return this.cudUserService.delete(id);
    }
}
