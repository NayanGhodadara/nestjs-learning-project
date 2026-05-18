import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import express from 'express';
import { ApiExcludeEndpoint } from 'node_modules/@nestjs/swagger/dist';

@Controller("")
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiExcludeEndpoint()
  @Get('change-log')
  getPage(@Res() res: express.Response) {
    return res.render('change-log');
  }

  @ApiExcludeEndpoint()
  @Get('socket-change-log')
  getSocketChangeLog(@Res() res: express.Response) {
    return res.render('socket-change-log');
  }
}


