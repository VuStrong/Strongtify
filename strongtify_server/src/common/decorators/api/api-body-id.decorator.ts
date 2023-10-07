import { applyDecorators } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";

export const ApiBodyId = (idName: string) => {
    return applyDecorators(
        ApiBody({
            schema: {
                type: "object",
                properties: {
                    [idName]: {
                        description: `Id of entity`,
                    },
                },
            },
        }),
    );
};
