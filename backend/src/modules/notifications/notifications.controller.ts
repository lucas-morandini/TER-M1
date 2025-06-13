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
import { Public } from 'src/decorators/public.decorator';
import { Request } from 'express';
import { CurrentUser } from 'src/decorators/currentuser.decorator';
import { NotificationsService } from './notifications.service';
import { UserDto } from '../users/dto/user.dto';
import { NotificationDto } from './dto/notification.dto';

@ApiTags('notifications')
@Controller(['notification', 'notifications'])
export class NotificationsController { 
    constructor(
        private readonly notificationService: NotificationsService,
    ){}

    @ApiOperation({ summary: 'Get All Notifications for a user' })
    @ApiOkResponse({ description: 'Notifications fetched successfully' })
    @ApiNotFoundResponse({ description: 'Notifications not found' })
    @Get('user/:userId')
    async getAllNotifications(@CurrentUser() user: UserDto, @Param('userId') userId: number) : Promise<number[]>{    
        if (user.id !== userId) {
            throw new BadRequestException('You can only fetch notifications for your own account');
        }
        return await this.notificationService.findAllByUser(user.id);
    }

    @ApiOperation({ summary: 'Get All Notifications for a user (read or not)' })
    @ApiOkResponse({ description: 'Notifications fetched successfully' })
    @ApiNotFoundResponse({ description: 'Notifications not found' })
    @Get('all/:userId')
    async getAllNotificationsForUser(@CurrentUser() user: UserDto, @Param('userId') userId: number) : Promise<number[]> {
        if (user.id !== userId) {
            throw new BadRequestException('You can only fetch notifications for your own account');
        }
        return await this.notificationService.findAll(user.id);
    }

    @ApiOperation({ summary: 'Get Notification by ID' })
    @ApiOkResponse({ description: 'Notification fetched successfully' })
    @ApiNotFoundResponse({ description: 'Notification not found' })
    @Get(':id')
    async getNotificationById(@CurrentUser() user: UserDto, @Param('id') id: number) : Promise<NotificationDto> {
        const notification : NotificationDto | null = await this.notificationService.findOne(id, user.id);
        if (!notification) {
            throw new BadRequestException('Notification not found or does not belong to the user');
        }
        return notification;
    }
}