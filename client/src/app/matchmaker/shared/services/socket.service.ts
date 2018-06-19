import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import * as socketIo from 'socket.io-client';

const SERVER_URL = 'https://mds-rock-paper-scissors-server.herokuapp.com:80';

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
    this.socket.emit('register-player', {username: name});
  }

  public onPlayerMatched(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('player-matched', (data: any) => observer.next(data));
    });
  }
}
