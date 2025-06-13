import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Param,
    Post,
    Put,
    Query,
    Req,
} from '@nestjs/common';

import {
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
  } from '@nestjs/swagger';
import { ConnectRequest } from './request/connect.request';
import { UsersService } from './users.service';
import { Public } from 'src/decorators/public.decorator';
import { ConnectResponse } from './response/connect.response';
import { RegisterRequest } from './request/register.request';
import { RegisterResponse } from './response/register.response';
import { ForgotPasswordRequest } from './request/forgotpassword.request';
import { ForgotPasswordResponse } from './response/forgotpassword.response';
import { Request } from 'express';
import { ResetPasswordRequest } from './request/resetpassword.request';
import { ResetPasswordResponse } from './response/resetpassword.response';
import { UpdateUserRequest } from './request/updateuser.request';
import { UserDto } from './dto/user.dto';
import { CurrentUser } from 'src/decorators/currentuser.decorator';

@ApiTags('users')
@Controller(['user', 'users'])
export class UsersController { 
    constructor(
        private readonly usersService: UsersService,
    ){}
    @ApiOperation({ summary: 'Get All Users' })
    @ApiOkResponse({ description: 'Users fetched successfully' })
    @ApiNotFoundResponse({ description: 'Users not found' })
    @Get()
    @Public()
    async getAllUsers() {
        return await this.usersService.findAll();
    }

    @ApiOperation({ summary: 'Connect a user' })
    @ApiOkResponse({ description: 'User connected successfully' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @Post('connect')
    @Public()
    async connectUser(@Body() body: ConnectRequest) : Promise<ConnectResponse>{
        const { email, password } = body;
        return await this.usersService.login(email, password);
    }
    
    @ApiOperation({ summary: 'Register a user' })
    @ApiOkResponse({ description: 'User registered successfully' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @Post('register')
    @Public()
    async registerUser(@Body() body: RegisterRequest) : Promise<RegisterResponse>{
        const {username, email, pwd, birth_date, tel, sex, name, first_name } = body;
        return await this.usersService.register(username, email, pwd, birth_date, tel, sex, name, first_name);
    }

    @ApiOperation({ summary: 'Forgot password' })
    @ApiOkResponse({ description: 'Password reset link sent successfully' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @Post('forgot-password')
    @Public()
    async forgotPassword(@Body() body: ForgotPasswordRequest, @Req() req: Request) : Promise<ForgotPasswordResponse>{
        const { email } = body;
        const origin = req.get('origin');
        if (!origin) {
            throw new InternalServerErrorException('Origin not found');
        }
        try {
            return await this.usersService.forgotPassword(email, origin);
        }catch (error) {
            console.error('Error sending forgot password email:', error);
            throw new InternalServerErrorException('Error sending email');
        }
    }

    @ApiOperation({ summary: 'Reset password' })
    @ApiOkResponse({ description: 'Password reset successfully' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @Post('reset-password')
    @Public()
    async resetPassword(@Body() body: ResetPasswordRequest) : Promise<ResetPasswordResponse>{
        const { token, password } = body;
        return await this.usersService.resetPassword(token, password);
    }

    @ApiOperation({ summary: 'Update user' })
    @ApiOkResponse({ description: 'User updated successfully' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @Put('update/:id')
    async updateUser(@CurrentUser() user : UserDto, @Body() body: UpdateUserRequest, @Param('id') id: number) : Promise<UserDto>{
        if (user.id !== id) {
            console.error(`User ${user.id} tried to update user ${id}`);
            throw new BadRequestException('You are not allowed to update this user');
        }
        return await this.usersService.updateUser(id, body);
    }

    @ApiOperation({ summary: 'Get user by id' })
    @ApiOkResponse({ description: 'User fetched successfully' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @Get(':id')
    async getUserById(@CurrentUser() user : UserDto, @Param('id') id: number) : Promise<UserDto> {
        if (user.id !== id) {
            console.error(`User ${user.id} tried to access user ${id}`);
            throw new BadRequestException('You are not allowed to access this user');
        }
        return await this.usersService.findById(id);
    }
}
