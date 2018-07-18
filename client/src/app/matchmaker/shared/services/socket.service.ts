import { Injectable } from '@angular/core';
import { Observable ,  Observer } from 'rxjs';

import * as socketIo from 'socket.io-client';
import { PlayerMoves } from '../../../models/PlayerMoves';

const SERVER_URL = 'http://localhost:80';
// const SERVER_URL = "https://mds-rock-paper-scissors-server.herokuapp.com";

@Injectable()
export class SocketService {
  private socket;

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }

  public send(message: any): void {
    this.socket.emit('message', message);
  }

  public registerPlayer(name: string) {
    this.socket.emit('register-player', { username: name });
  }

  public onPlayerMatched(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('player-matched', (data: any) => observer.next(data));
    });
  }

  public onOpponentDisconnected(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('player-disconnected', () => observer.next());
    });
  }

  public onPlayerAcknowledged(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('player-acknowledged', () => observer.next());
    });
  }
  public sendPlayerMove(move: PlayerMoves) {
    this.socket.emit('answer-submitted', { move: move });
  }

  public onMatchDecision(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('match-decision', (data: any) => observer.next(data));
    });
  }
}
