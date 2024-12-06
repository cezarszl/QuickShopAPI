import { applyDecorators } from "@nestjs/common";
import { Validate } from "class-validator";
import { DoesExistValidator } from "src/validators/does-exist.validator";



export function DoesExist(model: string, field: string) {
    return applyDecorators(
        Validate(DoesExistValidator, [model, field])
    );
}
