import { GameSession } from '../models/GameSession';
import { GameOutcomes } from '../models/GameOutcomes';
import { PlayerMoves } from '../models/PlayerMoves';
import { Player } from '../models/Player';
import { InvalidPlayerMoveException } from '../exceptions/InvalidPlayerMoveException';

export class DecisionMakerService {
  public getMatchDecision(session: GameSession) {
    const playerOneMove: PlayerMoves = session.playerOne.move;
    const playerTwoMove: PlayerMoves = session.playerTwo.move;

    if (!(playerOneMove in PlayerMoves) || !(playerTwoMove in PlayerMoves)) {
      throw new InvalidPlayerMoveException('invalid player move');
    }

    if (playerOneMove === playerTwoMove) {
      return this.assignMatchOutcome(
        session.playerOne,
        session.playerTwo,
        GameOutcomes.DRAW,
        GameOutcomes.DRAW
      );
    }
    if (
      playerOneMove === PlayerMoves.ROCK &&
      playerTwoMove === PlayerMoves.PAPER
    ) {
      return this.assignMatchOutcome(
        session.playerOne,
        session.playerTwo,
        GameOutcomes.LOSE,
        GameOutcomes.WIN
      );
    } else if (
      playerOneMove === PlayerMoves.PAPER &&
      playerTwoMove === PlayerMoves.ROCK
    ) {
      return this.assignMatchOutcome(
        session.playerOne,
        session.playerTwo,
        GameOutcomes.WIN,
        GameOutcomes.LOSE
      );
    } else if (
      playerOneMove === PlayerMoves.ROCK &&
      playerTwoMove === PlayerMoves.SCISSORS
    ) {
      return this.assignMatchOutcome(
        session.playerOne,
        session.playerTwo,
        GameOutcomes.WIN,
        GameOutcomes.LOSE
      );
    } else if (
      playerOneMove === PlayerMoves.SCISSORS &&
      playerTwoMove === PlayerMoves.ROCK
    ) {
      return this.assignMatchOutcome(
        session.playerOne,
        session.playerTwo,
        GameOutcomes.LOSE,
        GameOutcomes.WIN
      );
    } else if (
      playerOneMove === PlayerMoves.SCISSORS &&
      playerTwoMove === PlayerMoves.PAPER
    ) {
      return this.assignMatchOutcome(
        session.playerOne,
        session.playerTwo,
        GameOutcomes.WIN,
        GameOutcomes.LOSE
      );
    } else if (
      playerOneMove === PlayerMoves.PAPER &&
      playerTwoMove === PlayerMoves.SCISSORS
    ) {
      return this.assignMatchOutcome(
        session.playerOne,
        session.playerTwo,
        GameOutcomes.LOSE,
        GameOutcomes.WIN
      );
    }
  }
  private assignMatchOutcome(
    playerOne: Player,
    playerTwo: Player,
    playerOneOutcome: GameOutcomes,
    playerTwoOutcome: GameOutcomes
  ) {
    const matchResult: any = {};
    matchResult[playerOne.username] = playerOneOutcome;
    matchResult[playerTwo.username] = playerTwoOutcome;
    return matchResult;
  }
}
