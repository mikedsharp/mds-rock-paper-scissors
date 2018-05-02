import { Component, OnInit } from '@angular/core';
import {SocketService} from '../matchmaker/shared/services/socket.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  private messageContent: string;
  private ioConnection: any;
  private messages: any[] = [];
  
  constructor(private socketService: SocketService) { 

  }

  ngOnInit(): void {
    this.initIoConnection();
  }

  sendMessage(message: string):void {
    this.socketService.send(message);
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: any) => {
        this.messages.push(message);
      });
  }

}
