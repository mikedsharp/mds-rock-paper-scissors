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
  private players: any;
  private sessions: GameSession[];
  private decisionMaker: DecisionMakerService;
  private poller: any;
  constructor(app: express.Application, port: Number) {
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
    const unmatchedPlayers: Player[] = _.toArray(
      _.pickBy(this.players, player => {
        return !player.matched;
      })
    );

    if (unmatchedPlayers.length < 2) {
      return;
    }

    const playersListLength = unmatchedPlayers.length;
    let firstPlayerIndex;
    let secondPlayerIndex;

    firstPlayerIndex = Math.floor(Math.random() * playersListLength);
    unmatchedPlayers[firstPlayerIndex].matched = true;

    do {
      secondPlayerIndex = Math.floor(Math.random() * playersListLength);
    } while (secondPlayerIndex === firstPlayerIndex);

    unmatchedPlayers[secondPlayerIndex].matched = true;

    console.log(
      `player '${
        unmatchedPlayers[firstPlayerIndex].username
      }' matched with player '${unmatchedPlayers[secondPlayerIndex].username}'`
    );

    this.sessions.push(
      new GameSession(
        unmatchedPlayers[firstPlayerIndex],
        unmatchedPlayers[secondPlayerIndex]
      )
    );

    this.io.sockets.connected[unmatchedPlayers[firstPlayerIndex].socket].emit(
      'player-matched',
      {
        opponent: unmatchedPlayers[secondPlayerIndex].username
      }
    );
    this.io.sockets.connected[unmatchedPlayers[secondPlayerIndex].socket].emit(
      'player-matched',
      {
        opponent: unmatchedPlayers[firstPlayerIndex].username
      }
    );
  }
  private removeSession(session: GameSession) {
    // remove session from list of sessions
    const sessionIndex = this.sessions.indexOf(session);
    this.sessions.splice(sessionIndex, 1);
  }
  private registerPlayerEventListeners(socket: socketIo.Socket) {
    socket.on('answer-submitted', (data: any) => {
      console.log('answer was submitted...', data);
      const playerSessions = this.sessions.filter(session => {
        return (
          session.playerOne.socket === socket.id ||
          session.playerTwo.socket === socket.id
        );
      });
      if (playerSessions.length === 0) {
        return;
      }
      playerSessions[0].registerPlayerMove(
        this.players[socket.id].username,
        data.move
      );

      if (playerSessions[0].playersMovesSubmitted) {
        const matchDecision = this.decisionMaker.getMatchDecision(
          playerSessions[0]
        );
        this.io.sockets.connected[playerSessions[0].playerOne.socket].emit(
          'match-decision',
          {
            matchDecision: matchDecision[playerSessions[0].playerOne.username],
            opponentMove: playerSessions[0].playerTwo.move
          }
        );
        this.io.sockets.connected[playerSessions[0].playerTwo.socket].emit(
          'match-decision',
          {
            matchDecision: matchDecision[playerSessions[0].playerTwo.username],
            opponentMove: playerSessions[0].playerOne.move
          }
        );

        this.removeSession(playerSessions[0]);
      }
    });
    socket.on('register-player', (data: any) => {
      console.log('in register player...');
      if (_.toArray(_.pickBy(this.players)).length === 0) {
        console.log('starting poller...');
        this.poller = setInterval(() => this.matchPlayers(), 5000);
      }
      this.players[socket.id] = new Player(data.username, socket.id);
      this.io.sockets.connected[socket.id].emit('player-acknowledged');
      console.log(`registered player: ${data.username}`);
    });
    socket.on('disconnect', () => {
      console.log(`client disconnected`);
      for (var socketId in this.players) {
        if (this.players[socketId].socket === socket.id) {
          console.log(`${this.players[socketId].username} disconnected`);
          delete this.players[socketId];
          const leavingPlayersSession = this.sessions.filter(session => {
            return (
              session.playerOne.socket === socketId ||
              session.playerTwo.socket === socketId
            );
          });
          if (leavingPlayersSession.length > 0) {
            if (leavingPlayersSession[0].playerOne.socket === socketId) {
              this.io.sockets.connected[
                leavingPlayersSession[0].playerTwo.socket
              ].emit('player-disconnected');
            } else {
              this.io.sockets.connected[
                leavingPlayersSession[0].playerOne.socket
              ].emit('player-disconnected');
            }
            this.removeSession(leavingPlayersSession[0]);
          }

          if (_.toArray(_.pickBy(this.players)).length === 0) {
            console.log('killing poller...');
            clearInterval(this.poller);
          }
          break;
        }
      }
    });
  }
  private onPlayerConnect(socket: socketIo.Socket) {
    console.log('Connected client on port %s.', this.port);
    this.registerPlayerEventListeners(socket);
  }
  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running websocket server on port %s', this.port);
    });
    this.io.on('connect', (socket: any) => this.onPlayerConnect(socket));
  }
}
