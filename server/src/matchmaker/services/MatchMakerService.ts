import * as socketIo from 'socket.io';
import { createServer, Server } from 'http';
import * as express from 'express';

export class MatchMakerService {
    private io: socketIo.Server;
    private app: express.Application;
    private server: Server;
    private port: Number;

    constructor(app:express.Application, port:Number) {
        this.app = app;
        this.port = port;
        this.createServer();
        this.sockets();
        this.listen();

    }
    private sockets(): void {
        this.io = socketIo(this.server);
    }
    private createServer(): void {
        this.server = createServer(this.app);
    }
    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            socket.on('message', (m: String) => {
                console.log(m);
                this.io.emit('message', m);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }
}