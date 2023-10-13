import { User } from "@prisma/client";
import { UserDetailParamDto } from "../dtos/query-params/user-detail-param.dto";
import { UserDetailResponseDto } from "../dtos/get/user-detail-response.dto";
import { AccountParamDto } from "../dtos/query-params/account-param.dto";
import { PagedResponseDto } from "src/common/dtos/paged-response.dto";

/**
 * Interface for User to perform Read operations
 */
export interface GetUserService {
    findById(id: string): Promise<User>;

    findByEmail(email: string): Promise<User>;

    /**
     * find User by ID include relationships
     * @param id - User's ID
     * @param detailParams - options to include details
     */
    findByIdWithDetails(
        id: string,
        detailParams: UserDetailParamDto,
    ): Promise<UserDetailResponseDto>;

    get(userParams: AccountParamDto): Promise<PagedResponseDto<User>>;
}
