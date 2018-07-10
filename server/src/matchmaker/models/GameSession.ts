import { Player } from "./Player";
import { PlayerMoves } from "./PlayerMoves";

export class GameSession {
  private _playerOne: Player;
  private _playerTwo: Player;
  constructor(playerOne: Player, playerTwo: Player) {
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
  }
  public registerPlayerMove(username: string, move: PlayerMoves) {
    if (username === this.playerOne.username) {
      this.playerOne.move = move;
    } else {
      this.playerTwo.move = move;
    }
  }
  get playersMovesSubmitted() {
    return this.playerOne.moved && this.playerTwo.moved;
  }
  get playerOne() {
    return this._playerOne;
  }
  set playerOne(player: Player) {
    this._playerOne = player;
  }
  get playerTwo() {
    return this._playerTwo;
  }
  set playerTwo(player: Player) {
    this._playerTwo = player;
  }
}
