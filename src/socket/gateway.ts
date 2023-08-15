import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageDto } from './types/message';
import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from '../schema/message.schema';

@WebSocketGateway()
export class MyGateway implements OnModuleInit, OnGatewayDisconnect {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('Message') private readonly MessageModel: Model<Message>,
  ) {}
  @WebSocketServer()
  server: Server;
  users: Array<any> = [];
  onModuleInit(): any {
    this.server.on('connection', async (socket) => {
      const token = socket.handshake.headers.authorization;
      if (!token) {
        socket.disconnect();
        return;
      }
      const decodedToken = this.jwtService.verify(token, {
        secret: 'strong_key',
      });
      if (this.users.length > 0) {
        this.users.map((user) => {
          socket.emit('alert', `Este Online ${user.user}`);
        });
      }
      //alerta la conectare cu toti utilizatorii online


      this.users.push({
        user: decodedToken.username,
        socket: socket,
        roomId: decodedToken.roomId,
      });
      console.log(
        `Connected:${decodedToken.username} to Room:${decodedToken.roomId}`,
      );
      this.server.emit('alert', `Este Online ${decodedToken.username}`);
      //Alerta ca utilizatorul a intrat online


      const messages = await this.MessageModel.find({
        roomId: decodedToken.roomId,
      });
      messages.map((message) => {
        socket.emit('newMessage', `${message.creator}:${message.message}`);
      });
    });
  }

  handleDisconnect(socket: Socket) {
    this.users = this.users.filter((user) => {
      if (user.socket !== socket) {
        return user;
      }
      this.server.emit('alert', `Disconect:${user.user}`);
      console.log(`Disconect:${user.user}`);
    });
    // Alerta ca utilizatorul sa deconectat
  }
  @SubscribeMessage('message')
  async listenForMessages(
    @MessageBody() data: MessageDto,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    const client = this.users.find((user) => user.socket === clientSocket);
    //se gaseste informartia despre user care a trimis informatia in ce camera se afla si username lui

    const doc = new this.MessageModel({
      message: data.message,
      roomId: client.roomId,
      creator: client.user,
      createAt: new Date(),
    });
    await doc.save();
    // se salveaza mesajul in database

    const room = this.users.filter((user) => user.roomId === client.roomId);
    room.map((userRoom) => {
      userRoom.socket.emit('newMessage', `${client.user}:${data.message}`);
    });
    // mesajul se trimite la toti din camera

    console.log(
      `Data: ${data.message}, Client:${client.user},Room:${client.roomId}`,
    );
  }
}
