import { ReminderType } from './../../constants/app.constants';
import { ApiBearerAuth, ApiOperation } from 'node_modules/@nestjs/swagger/dist';
import { ReminderDto } from './reminder.dto';
import { ReminderService } from './reminder.service';
import { Body, Controller, HttpStatus, Post, Req, UseGuards } from "node_modules/@nestjs/common";
import { AuthGuard } from 'src/gard/auth.guard';

@Controller("reminder")
export class ReminderController {
    constructor(
        private reminderService: ReminderService
    ) { }

    @Post("set-reminder")
    @ApiOperation({ summary: "set reminder", description: `**reminder type** :${Object.values(ReminderType).map(s => `\`${s}\``).join(', ')}` })
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async setReminder(@Req() req, @Body() reminderDto: ReminderDto) {
        const data = await this.reminderService.createReminder(req.user.uid, reminderDto)
        return {
            statusCode: HttpStatus.OK,
            message: "Success",
            data: data
        }
    }

}