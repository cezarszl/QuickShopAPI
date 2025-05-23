import { Controller, Post, Body, Get, Param, Delete, ParseIntPipe, HttpCode, UseGuards, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { ApiTags, ApiBody, ApiParam, ApiOperation, ApiResponse, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update.user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';


@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UserController {
    constructor(private readonly userService: UserService) { }

    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: UserDto })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiBody({ type: CreateUserDto })
    @UseGuards(JwtAuthGuard)
    @Post()
    async createUser(@Body() createUserDto: { email: string; password: string; name: string }): Promise<User> {
        return this.userService.createUser(createUserDto);
    }

    @ApiOperation({ summary: 'Find a user by ID' })
    @ApiResponse({ status: 200, description: 'The user details', type: UserDto })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.userService.findUserById(id);
    }


    @ApiOperation({ summary: 'Update a user by ID' })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID of the user to update',
        example: '1',
    })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({
        status: 200,
        description: 'The user has been successfully updated.',
        type: UserDto,
    })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.userService.updateUser(id, updateUserDto);
    }


    @ApiOperation({ summary: 'Change user password' })
    @ApiOkResponse({ description: 'Password successfully changed' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @UseGuards(JwtAuthGuard)
    @Put(':id/change-password')
    async changePassword(@Param('id', ParseIntPipe) id: number, @Body() changeUserDto: ChangePasswordDto): Promise<User> {
        return this.userService.changePassword(id, changeUserDto);
    }

    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiResponse({ status: 204, description: 'The user has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.userService.deleteUser(id);

    }
}
