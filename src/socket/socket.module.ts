import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from '../schema/message.schema';
import { UserSchema } from '../schema/user.schema';
import { SocketController } from './socket.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Message',
        schema: MessageSchema,
      },
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
  ],
  providers: [MyGateway],
  controllers: [SocketController],
})
export class SocketModule {}
