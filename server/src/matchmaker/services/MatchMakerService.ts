import * as socketIo from 'socket.io';
import { createServer, Server } from 'http';
import * as express from 'express';
import * as _ from 'lodash';

export class MatchMakerService {
    private io: socketIo.Server;
    private app: express.Application;
    private server: Server;
    private port: Number;
    private players:any;
    private poller:any;
    constructor(app:express.Application, port:Number) {
        this.app = app;
        this.port = port;
        this.players = {};
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
    private matchPlayers() {
        const unmatchedPlayers = _.toArray(_.pickBy(this.players, player => {
            return !player.matched;
        }));

        if(unmatchedPlayers.length < 2) {
            return;
        }

        unmatchedPlayers[0].matched = true;
        unmatchedPlayers[1].matched = true;

        console.log(`player '${unmatchedPlayers[0].username}' matched with player '${unmatchedPlayers[1].username}'`);
        this.io.sockets.connected[unmatchedPlayers[0].socket].emit('player-matched', {
            opponent: unmatchedPlayers[1].username
        });
        this.io.sockets.connected[unmatchedPlayers[1].socket].emit('player-matched', {
            opponent: unmatchedPlayers[0].username
        });
    }
    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running websocket server on port %s', this.port);
        });
        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            socket.on('register-player', (data:any) => {
                if(_.toArray(_.pickBy(this.players)).length === 0) {
                    console.log('starting poller...');
                    this.poller = setInterval(() => this.matchPlayers(), 1000);
                }
                this.players[socket.id] = {
                    socket: socket.id,
                    username: data.username
                };
                console.log(`registered player: ${data.username}`);
            });

            socket.on('disconnect', () => {
                for(var socketId in this.players) {
                    if(this.players[socketId].socket === socket.id) {
                        console.log(`${this.players[socketId].username} disconnected`);
                        delete this.players[socketId];
                        if(_.toArray(_.pickBy(this.players)).length === 0) {
                            console.log('killing poller...');
                            clearInterval(this.poller);
                        }
                        break;
                    }
                }	
            });
        });
    }
}