import { Get, Injectable } from '@nestjs/common';
import { Cron } from 'node_modules/@nestjs/schedule';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}