import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
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
import { ServicesService } from './services.service';

@ApiTags('services')
@Controller(['service', 'services'])
export class ServicesController { 
    constructor(
        private readonly serviceService: ServicesService,
    ){}

    @ApiOperation({ summary: 'Update bd data' })
    @ApiOkResponse({ description: 'Data updated successfully' })
    @ApiNotFoundResponse({ description: 'Data not found' })
    @Post('update')
    @Public()
    async updateData(@Req() req : Request): Promise<string> {
        console.log('Updating data...');
        const locale : string = req.query.locale as string || 'fr-FR';
        try {
            await this.serviceService.updateData(locale);
            console.log('Data updated successfully');
            return 'Data updated successfully';
        } catch (error) {
            console.error('Error updating data:', error);
            throw new InternalServerErrorException('Failed to update data');
        }
    }

    @ApiOperation({ summary: 'Update bd data when model is up' })
    @ApiOkResponse({ description: 'Data updated successfully' })
    @ApiNotFoundResponse({ description: 'Data not found' })
    @Post('model_up')
    @Public()
    @HttpCode(200)
    async updateDataWhenModelUp(@Req() req : Request): Promise<string> {
        const locale : string = req.query.locale as string || 'fr-FR';
        this.serviceService.updateData(locale);
        return 'Data updated successfully';
    }
}