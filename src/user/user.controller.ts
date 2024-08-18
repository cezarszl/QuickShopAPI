import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { ApiTags, ApiBody, ApiParam, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: UserDto })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiBody({
        description: 'Data required to create a new user',
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@domain.com' },
                password: { type: 'string', example: 'password123' },
                name: { type: 'string', example: 'John Doe' },
            },
        },
    })
    @Post()
    async createUser(@Body() createUserDto: { email: string; password: string; name: string }): Promise<User> {
        return this.userService.createUser(createUserDto);
    }

    @ApiOperation({ summary: 'Find a user by ID' })
    @ApiResponse({ status: 200, description: 'The user details', type: UserDto })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @Get(':id')
    async findUserById(@Param('id') id: number): Promise<User> {
        return this.userService.findUserById(id);
    }

    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiResponse({ status: 200, description: 'The user has been successfully deleted.', type: UserDto })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @Delete(':id')
    async deleteUser(@Param('id') id: number): Promise<User> {
        return this.userService.deleteUser(id);
    }
}
