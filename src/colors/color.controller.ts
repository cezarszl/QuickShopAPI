import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('colors')
@Controller('colors')
export class ColorController {
    constructor(private readonly colorService: Colr)


}
