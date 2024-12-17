import { applyDecorators } from "@nestjs/common";
import { Validate } from "class-validator";
import { IsUniqueValidator } from "src/validators/is-unique.validator";


export function IsUnique(model: string, field: string) {
    return applyDecorators(
        Validate(IsUniqueValidator, [model, field])
    );
}
