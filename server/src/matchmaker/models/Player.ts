import { PlayerMoves } from "../models/PlayerMoves";
export class Player {
  private _username: string;
  private _socket: string;
  private _matched: boolean;
  private _move: PlayerMoves;

  constructor(username: string, socket: string) {
    this.username = username;
    this.socket = socket;
    this.matched = false;
    this.move = null;
  }
  get username() {
    return this._username;
  }
  set username(name: string) {
    this._username = name;
  }
  get socket() {
    return this._socket;
  }
  set socket(socket: string) {
    this._socket = socket;
  }

  get matched() {
    return this._matched;
  }
  set matched(matched: boolean) {
    this._matched = matched;
  }

  get move() {
    return this._move;
  }

  set move(move: PlayerMoves) {
    this._move = move;
  }

  get moved() {
    return this._move !== null;
  }
}
