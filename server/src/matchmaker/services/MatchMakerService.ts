import * as socketIo from 'socket.io';
import { createServer, Server } from 'http';
import * as express from 'express';
import * as _ from 'lodash';
import { Player } from '../models/Player';
import { GameSession } from '../models/GameSession';
import { DecisionMakerService } from './DecisionMakerService';

export class MatchMakerService {
    private io: socketIo.Server;
    private app: express.Application;
    private server: Server;
    private port: Number;
    private players:any;
    private sessions: GameSession[];
    private decisionMaker: DecisionMakerService;
    private poller:any;
    constructor(app:express.Application, port:Number) {
        this.app = app;
        this.port = port;
        this.players = {};
        this.sessions = [];
        this.decisionMaker = new DecisionMakerService();
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
        const unmatchedPlayers: Player[] = _.toArray(_.pickBy(this.players, player => {
            return !player.matched;
        }));

        if(unmatchedPlayers.length < 2) {
            return;
        }

        unmatchedPlayers[0].matched = true;
        unmatchedPlayers[1].matched = true;

        console.log(`player '${unmatchedPlayers[0].username}' matched with player '${unmatchedPlayers[1].username}'`);
        
        this.sessions.push(new GameSession(unmatchedPlayers[0], unmatchedPlayers[1]));

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
            socket.on('answer-submitted', (data: any) => {
                console.log('answer was submitted...', data);
                const playerSessions = this.sessions.filter(session => {
                    return (session.playerOne.socket === socket.id) 
                        || (session.playerTwo.socket === socket.id);
                });
                if (playerSessions.length === 0) {
                    return;
                }
                playerSessions[0].registerPlayerMove(this.players[socket.id].username, data.move);
                
                if (playerSessions[0].playersMovesSubmitted){
                    const matchDecision = this.decisionMaker.getMatchDecision(playerSessions[0]);
                    this.io.sockets.connected[playerSessions[0].playerOne.socket].emit('match-decision', {
                        matchDecision: matchDecision[playerSessions[0].playerOne.username]
                    });
                    this.io.sockets.connected[playerSessions[0].playerTwo.socket].emit('match-decision', {
                        matchDecision: matchDecision[playerSessions[0].playerTwo.username]
                    });
                }
            });
            socket.on('register-player', (data:any) => {
                console.log('in register player...');
                if(_.toArray(_.pickBy(this.players)).length === 0) {
                    console.log('starting poller...');
                    this.poller = setInterval(() => this.matchPlayers(), 1000);
                }
                this.players[socket.id] = new Player(data.username, socket.id);
                console.log(`registered player: ${data.username}`);
            });

            
            socket.on('disconnect', () => {
                console.log(`client disconnected`);
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