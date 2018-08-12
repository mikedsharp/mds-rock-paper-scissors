import * as socketIo from 'socket.io';
import * as _ from 'lodash';
import { Player } from '../models/Player';
import { GameSession } from '../models/GameSession';
import { DecisionMakerService } from './DecisionMakerService';
import { SocketService } from './SocketService';
import { SessionService } from './SessionService';

export class MatchMakerService {
  private socketService: SocketService;
  private sessionService: SessionService;
  private players: any;
  private decisionMaker: DecisionMakerService;
  private poller: any;
  constructor(socketService: SocketService) {
    this.players = {};
    this.socketService = socketService;
    this.socketService.addListener(this.onPlayerConnect.bind(this));
    this.decisionMaker = new DecisionMakerService();
    this.sessionService = new SessionService();
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

    this.sessionService.createNewSession(
      unmatchedPlayers[firstPlayerIndex],
      unmatchedPlayers[secondPlayerIndex]
    );

    this.socketService.connectedClients[
      unmatchedPlayers[firstPlayerIndex].socket
    ].emit('player-matched', {
      opponent: unmatchedPlayers[secondPlayerIndex].username
    });
    this.socketService.connectedClients[
      unmatchedPlayers[secondPlayerIndex].socket
    ].emit('player-matched', {
      opponent: unmatchedPlayers[firstPlayerIndex].username
    });
  }

  private onAnswerSubmitted(socket: socketIo.Socket, data: any) {
    console.log('answer was submitted...', data);
    const playerSession = this.sessionService.getSessionBySocketId(socket.id);
    playerSession.registerPlayerMove(
      this.players[socket.id].username,
      data.move
    );

    if (playerSession.playersMovesSubmitted) {
      const matchDecision = this.decisionMaker.getMatchDecision(playerSession);
      this.socketService.connectedClients[playerSession.playerOne.socket].emit(
        'match-decision',
        {
          matchDecision: matchDecision[playerSession.playerOne.username],
          opponentMove: playerSession.playerTwo.move
        }
      );
      this.socketService.connectedClients[playerSession.playerTwo.socket].emit(
        'match-decision',
        {
          matchDecision: matchDecision[playerSession.playerTwo.username],
          opponentMove: playerSession.playerOne.move
        }
      );

      this.sessionService.remove(playerSession);
    }
  }
  private onRegisterPlayer(socket: socketIo.Socket, data: any) {
    console.log('in register player...');
    if (_.toArray(_.pickBy(this.players)).length === 0) {
      console.log('starting poller...');
      this.poller = setInterval(() => this.matchPlayers(), 5000);
    }
    this.players[socket.id] = new Player(data.username, socket.id);
    this.socketService.connectedClients[socket.id].emit('player-acknowledged');
    console.log(`registered player: ${data.username}`);
  }
  private onPlayerDisconnected(socket: socketIo.Socket) {
    console.log(`client disconnected`);
    for (var socketId in this.players) {
      if (this.players[socketId].socket === socket.id) {
        console.log(`${this.players[socketId].username} disconnected`);
        delete this.players[socketId];

        const leavingPlayersSession = this.sessionService.getSessionBySocketId(
          socketId
        );
        if (leavingPlayersSession) {
          if (leavingPlayersSession.playerOne.socket === socketId) {
            this.socketService.connectedClients[
              leavingPlayersSession.playerTwo.socket
            ].emit('player-disconnected');
          } else {
            this.socketService.connectedClients[
              leavingPlayersSession.playerOne.socket
            ].emit('player-disconnected');
          }
          this.sessionService.remove(leavingPlayersSession);
        }

        if (_.toArray(_.pickBy(this.players)).length === 0) {
          console.log('killing poller...');
          clearInterval(this.poller);
        }
        break;
      }
    }
  }
  private registerPlayerEventListeners(socket: socketIo.Socket) {
    socket.on('answer-submitted', (data: any) => {
      this.onAnswerSubmitted(socket, data);
    });
    socket.on('register-player', (data: any) => {
      this.onRegisterPlayer(socket, data);
    });
    socket.on('disconnect', () => {
      this.onPlayerDisconnected(socket);
    });
  }
  private onPlayerConnect(socket: socketIo.Socket) {
    console.log('Connected client');
    this.registerPlayerEventListeners(socket);
  }
}
