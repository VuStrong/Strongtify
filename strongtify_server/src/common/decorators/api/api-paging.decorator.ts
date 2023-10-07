import { Type, applyDecorators } from "@nestjs/common";
import {
    ApiExtraModels,
    ApiOkResponse,
    ApiQuery,
    getSchemaPath,
} from "@nestjs/swagger";
import { PagedResponseDto } from "../../dtos/paged-response.dto";

export const ApiPaging = (model: Type, pagingModel: Type) => {
    return applyDecorators(
        ApiExtraModels(PagedResponseDto),
        ApiQuery({ type: () => pagingModel }),
        ApiOkResponse({
            schema: {
                allOf: [
                    {
                        $ref: getSchemaPath(PagedResponseDto),
                    },
                    {
                        properties: {
                            results: {
                                type: "array",
                                items: { $ref: getSchemaPath(model) },
                            },
                        },
                    },
                ],
            },
        }),
    );
};
