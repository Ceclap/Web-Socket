import { Body, Controller, Get } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';

@Controller('socket')
export class SocketController {
  constructor(private readonly jwtService: JwtService) {}

  @Get()
  async getToken(@Body() body) {
    const token = await this.jwtService.signAsync(body);
    return token;
  }
}
