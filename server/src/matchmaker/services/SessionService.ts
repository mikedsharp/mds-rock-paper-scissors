import { GameSession } from '../models/GameSession';
import { Player } from '../models/Player';

export class SessionService {
  private _sessions: GameSession[];
  constructor() {
    this._sessions = [];
  }

  public remove(session: GameSession): GameSession[] {
    // remove session from list of sessions
    const sessionIndex = this._sessions.indexOf(session);
    this._sessions.splice(sessionIndex, 1);
    return this._sessions;
  }
  
  public createNewSession(playerOne: Player, playerTwo: Player): GameSession {
    const newSession = new GameSession(playerOne, playerTwo);
    this._sessions.push(newSession);
    return newSession;
  }
  public getSessionBySocketId(desiredSocketId: string) {
    const playerSessions = this._sessions.filter(session => {
      return (
        session.playerOne.socket === desiredSocketId ||
        session.playerTwo.socket === desiredSocketId
      );
    });
    if (playerSessions.length === 0) {
      return null;
    }
    return playerSessions[0];
  }
}
