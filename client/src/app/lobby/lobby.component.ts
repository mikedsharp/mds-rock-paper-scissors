import { Component, OnInit } from '@angular/core';
import { SocketService } from '../matchmaker/shared/services/socket.service';
import { GameOutcomes } from '../models/GameOutcomes';
import { PlayerMoves } from '../models/PlayerMoves';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  private messageContent: string;
  private ioConnection: any;
  private onPlayerDecision: any;
  private onOpponentDisconnected: any;
  private onPlayerAcknowledged: any;
  public messages: any[] = [];
  public username: string;
  public nameSubmitted: boolean;
  public serverAcknowledgedPlayer: boolean;
  public opponent: object;
  private gameOutcomes: GameOutcomes;
  public matchDecision: any;
  public pastMatchResults: Array<any>;
  private lastMove: PlayerMoves;

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.username = '';
    this.opponent = null;
    this.nameSubmitted = false;
    this.serverAcknowledgedPlayer = false;
    this.matchDecision = null;
    this.lastMove = null;
    this.pastMatchResults = [];

    this.initIoConnection();
  }

  sendMessage(message: string): void {
    this.socketService.send(message);
  }

  sendPlayerMove(move: PlayerMoves) {
    this.lastMove = move;
    this.socketService.sendPlayerMove(move);
  }
  registerPlayer(name: string) {
    this.nameSubmitted = true;
    this.socketService.registerPlayer(name);
  }
  setUsername(username: string) {
    this.username = username;
  }
  startNewGame() {
    this.opponent = null;
    this.lastMove = null;
    this.matchDecision = null;
    this.serverAcknowledgedPlayer = false;
    this.socketService.registerPlayer(this.username);
  }

  get canPlayNewGame() {
    return this.matchDecision !== null;
  }

  getPlayerMove(move: PlayerMoves) {
    switch (move) {
      case PlayerMoves.ROCK: {
        return 'Rock';
      }
      case PlayerMoves.PAPER: {
        return 'Paper';
      }
      case PlayerMoves.SCISSORS: {
        return 'Scissors';
      }
    }
  }

  getResultTypeFromMatchResult(result: GameOutcomes) {
    switch (result) {
      case GameOutcomes.DRAW:
        return 'draw';
      case GameOutcomes.WIN:
        return 'win';
      case GameOutcomes.LOSE:
        return 'lose';
      case GameOutcomes.FORFEIT:
        return 'forfeit: opponent disconnected';
    }
  }

  getMatchResult() {}
  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService
      .onPlayerMatched()
      .subscribe((data: any) => {
        this.opponent = data.opponent;
      });
    this.onPlayerAcknowledged = this.socketService
      .onPlayerAcknowledged()
      .subscribe(() => {
        this.serverAcknowledgedPlayer = true;
      });
    this.onPlayerDecision = this.socketService
      .onMatchDecision()
      .subscribe((data: any) => {
        this.matchDecision = data.matchDecision;
        this.pastMatchResults.push({
          playerName: this.username,
          opponent: this.opponent,
          matchDecision: this.matchDecision,
          playerMove: this.lastMove,
          opponentMove: data.opponentMove
        });
        this.startNewGame();
      });
    this.onOpponentDisconnected = this.socketService
      .onOpponentDisconnected()
      .subscribe(() => {
        this.pastMatchResults.push({
          playerName: this.username,
          opponent: this.opponent,
          matchDecision: GameOutcomes.FORFEIT
        });
        this.startNewGame();
      });
  }
}
