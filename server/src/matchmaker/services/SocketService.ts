import * as socketIo from 'socket.io';
import { createServer, Server } from 'http';
import * as express from 'express';

export class SocketService {
  private io: socketIo.Server;
  private app: express.Application;
  private server: Server;
  private listeners: Function[];
  private port: Number;
  constructor(app: express.Application, port: Number) {
    this.app = app;
    this.port = port;
    this.listeners = [];
    this.createServer();
    this.initSockets();
  }
  private initSockets(): void {
    this.io = socketIo(this.server);
  }
  private createServer(): void {
    this.server = createServer(this.app);
  }
  private listen(socketConnectionListener: Function): void {
    this.server.listen(this.port, () => {
      console.log('Running websocket server on port %s', this.port);
    });
    this.io.on('connect', (socket: socketIo.Socket) =>
      socketConnectionListener(socket)
    );
  }
  public addListener(listener: Function) {
    this.listeners.push(listener);
    this.listen(listener);
  }
  public removeListener(listener: Function) {
    const listenerToRemoveIndex = this.listeners.indexOf(listener);
    if (listenerToRemoveIndex > -1) {
      this.listeners.splice(listenerToRemoveIndex, 1);
    }
  }
  public get sockets() {
    return this.io.sockets;
  }
  public get connectedClients() {
    return this.io.sockets.connected;
  }
}
