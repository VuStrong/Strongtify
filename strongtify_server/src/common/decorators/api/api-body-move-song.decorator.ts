import { applyDecorators } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";

export const ApiBodyMoveSong = () => {
    return applyDecorators(
        ApiBody({
            schema: {
                type: "object",
                properties: {
                    to: {
                        description: `Position to move to`,
                        type: "number",
                    },
                },
            },
        }),
    );
};
