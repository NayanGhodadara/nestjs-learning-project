import { SocketService } from './socket.service';
import { Controller } from "node_modules/@nestjs/common";
import { ApiExcludeController } from "node_modules/@nestjs/swagger/dist";

@ApiExcludeController()
@Controller()
export class SocketController {
    constructor(
        private readonly socketService: SocketService
    ) { }
}