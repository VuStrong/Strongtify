import {
    BadRequestException,
    ExecutionContext,
    createParamDecorator,
} from "@nestjs/common";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { QueryParamDto } from "../dtos/query-param.dto";

export const PagingQuery = createParamDecorator(
    async (data: ClassConstructor<QueryParamDto>, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        const pagingQuery = plainToInstance(data, request.query, {
            excludeExtraneousValues: true,
            exposeUnsetFields: false,
        });

        const errors = await validate(pagingQuery);
        if (errors.length > 0) {
            throw new BadRequestException(
                errors.map((e) => Object.values(e.constraints)[0]),
            );
        }

        pagingQuery.skip = pagingQuery.skip >= 0 ? pagingQuery.skip : 0;
        pagingQuery.take = pagingQuery.take > 0 ? pagingQuery.take : 1;

        return pagingQuery;
    },
);
