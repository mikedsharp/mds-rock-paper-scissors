import { Component, OnInit } from '@angular/core';
import {SocketService} from '../matchmaker/shared/services/socket.service';
import {GameOutcomes} from '../models/GameOutcomes';
import {PlayerMoves} from '../models/PlayerMoves';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  private messageContent: string;
  private ioConnection: any;
  private onPlayerDecision: any;
  private messages: any[] = [];
  private username: string;
  private nameSubmitted: boolean;
  private opponent: object;
  private gameOutcomes: GameOutcomes;
  private matchDecision: any;

  constructor(private socketService: SocketService) {

  }

  ngOnInit(): void {
    this.username = '';
    this.opponent = null;
    this.nameSubmitted = false;
    this.matchDecision = null;

    this.initIoConnection();
  }

  sendMessage(message: string): void {
    this.socketService.send(message);
  }

  sendPlayerMove(move: PlayerMoves) {
    this.socketService.sendPlayerMove(move);
  }
  registerPlayer(name: string) {
    this.nameSubmitted = true;
    this.socketService.registerPlayer(name);
  }

  setUsername(username: string) {
    this.username = username;
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onPlayerMatched()
      .subscribe((data: any) => {
        this.opponent = data.opponent;
      });
    this.onPlayerDecision = this.socketService.onMatchDecision()
      .subscribe((data: any) => {
        this.matchDecision = data.matchDecision;
      });
  }
}
