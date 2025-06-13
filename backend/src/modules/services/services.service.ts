import { Injectable } from '@nestjs/common';
import { UtilsService } from 'src/shared/utils/utils.service';

@Injectable()
export class ServicesService {

    constructor(
        private readonly utilsService: UtilsService,
    ) { }


    async updateData(locale: string): Promise<void> {
        await this.utilsService.planifiedTask(locale);
    }
}
