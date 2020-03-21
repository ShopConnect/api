import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';

import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserToken } from '../database/entities/user-token.entity';
import { DatabaseService } from '../database/database.service';
import { Server, Socket } from 'socket.io';
import { User } from '../database/entities/user.entity';

export class SocketClientData {
  connectedOn: Date;
  socketId: string;
  userId: number;
  accessToken: string;
}

@WebSocketGateway(3000)
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger("ChatGateway");
  private readonly userTokenRepository: Repository<UserToken>;
  private readonly clients: { [id: string]: SocketClientData } = {};

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly databaseService: DatabaseService,
  ) {
    this.userTokenRepository = this.databaseService.userTokenRepository;
  }

  afterInit(server: Server) {
    this.logger.verbose("Initialized!");
  }

  handleConnection(client: Socket, ...args: any[]) {
    let socketClientData = <SocketClientData>{
      connectedOn: new Date(),
      socketId: client.id
    };

    this.clients[client.id] = socketClientData;
    this.logger.verbose(`Created SocketClientData for ${client.id} (${client.conn.remoteAddress})`);

    setTimeout(this.checkAuthentication, 5000, this, client.id);
  }
 
  handleDisconnect(client: Socket) {
    this.logger.verbose(`${client.id} disconnected. Invalidating SocketClientData`);
    delete this.clients[client.id];
  }

  private getSocketFromId(id: string) {
    return this.server.clients().sockets[id];
  }

  private checkAuthentication(self: WebsocketGateway, clientId: string) {
    let client = self.clients[clientId];
    if (client == null) {
        return;
    }

    if (client.userId == 0 || client.accessToken == null) {
        try {
            self.server.clients().sockets[clientId].disconnect(true);
        }
        catch (error) {
            self.logger.error("disconnecting user failed");
        }
    }
  }

  public sendMessage(payload: any, ...users: (number | User)[]) {
      for (let user of users) {
          if (user instanceof Object) {
              user = user.id;
          }

          this.logger.verbose(`Sending message to ${user}`);

          let socketClientDatas = Object.values(this.clients);

          for (const socketClientData of socketClientDatas) {
              if (!socketClientData) {
                  continue;
              }

              if (socketClientData.userId != user) {
                  continue;
              }

              let socketClient = this.getSocketFromId(socketClientData.socketId);
              if (!socketClient) {
                  this.logger.warn(`Found SocketClientData for user ${socketClientData.userId} but socket is null!`);
                  return;
              }

              socketClient.emit(JSON.stringify(payload));
          }
      }
  }

  public sendMessageToClient(payload: any, socketId: string) {
      let socketClient = this.getSocketFromId(socketId);
      if (!socketClient) {
          this.logger.warn(`Got SocketId ${socketId} but SocketClientData is null!`);
          return;
      }

      socketClient.emit(JSON.stringify(payload));
  }

  public sendMessageToAll(payload: any) {
      let users = Object.keys(this.clients);
      for (let user of users) {
          this.sendMessageToClient(payload, user);
      }
  }

  @SubscribeMessage('auth')
  async authenticate(@ConnectedSocket() client: Socket, @MessageBody() data: { key: string }): Promise<void> {
      if (!data.key) {
          return;
      }

      let userToken = await this.userTokenRepository.findOne({
          where: {
              token: data.key,
          },
          relations: [
              "user"
          ]
      });

      if (!userToken) {
          client.disconnect(true);
          return;
      }

      this.clients[client.id].userId = userToken.user.id;
      this.clients[client.id].accessToken = userToken.token;

      client.emit("init", this.clients[client.id]);
      this.logger.verbose(`${client.id} authenticated as user ${userToken.user.id}`);
      return;
  }
}
