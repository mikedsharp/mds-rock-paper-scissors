import 'mocha';
import { assert } from 'chai';
import { DecisionMakerService } from '../src/matchmaker/services/DecisionMakerService';
import { GameSession } from '../src/matchmaker/models/GameSession';
import { Player } from '../src/matchmaker/models/Player';
import { PlayerMoves } from '../src/matchmaker/models/PlayerMoves';
import { GameOutcomes } from '../src/matchmaker/models/GameOutcomes';
import { InvalidPlayerMoveException } from '../src/matchmaker/exceptions/InvalidPlayerMoveException';

let service: DecisionMakerService;
let mockPlayerOne: Player;
let mockPlayerTwo: Player;
let mockSession: GameSession;

suite('DecisionMakerService.getMatchDecision()', () => {
  setup(function() {
    service = new DecisionMakerService();
    mockPlayerOne = new Player('player1', 'player-1-socket-id');
    mockPlayerTwo = new Player('player2', 'player-2-socket-id');
    mockSession = new GameSession(mockPlayerOne, mockPlayerTwo);
  });
  test(`player one chooses rock, player two chooses paper, 
        player one should lose, player one should win`, () => {
    mockPlayerOne.move = PlayerMoves.ROCK;
    mockPlayerTwo.move = PlayerMoves.PAPER;

    const result = service.getMatchDecision(mockSession);

    assertGameOutcome(
      result,
      mockPlayerOne.username,
      mockPlayerTwo.username,
      GameOutcomes.LOSE,
      GameOutcomes.WIN
    );
  });
  test(`player one chooses paper, player two chooses rock, 
        player one should win, player one should lose`, () => {
    mockPlayerOne.move = PlayerMoves.PAPER;
    mockPlayerTwo.move = PlayerMoves.ROCK;

    const result = service.getMatchDecision(mockSession);

    assertGameOutcome(
      result,
      mockPlayerOne.username,
      mockPlayerTwo.username,
      GameOutcomes.WIN,
      GameOutcomes.LOSE
    );
  });
  test(`player one chooses rock, player two chooses scissors, 
        player one should win, player two should lose`, () => {
    mockPlayerOne.move = PlayerMoves.ROCK;
    mockPlayerTwo.move = PlayerMoves.SCISSORS;

    const result = service.getMatchDecision(mockSession);

    assertGameOutcome(
      result,
      mockPlayerOne.username,
      mockPlayerTwo.username,
      GameOutcomes.WIN,
      GameOutcomes.LOSE
    );
  });
  test(`player one chooses scissors, player two chooses rock, 
        player one should lose, player two should win`, () => {
    mockPlayerOne.move = PlayerMoves.SCISSORS;
    mockPlayerTwo.move = PlayerMoves.ROCK;

    const result = service.getMatchDecision(mockSession);

    assertGameOutcome(
      result,
      mockPlayerOne.username,
      mockPlayerTwo.username,
      GameOutcomes.LOSE,
      GameOutcomes.WIN
    );
  });

  test(`player one chooses paper, player two chooses scissors, 
        player one should lose, player two should win`, () => {
    mockPlayerOne.move = PlayerMoves.PAPER;
    mockPlayerTwo.move = PlayerMoves.SCISSORS;

    const result = service.getMatchDecision(mockSession);

    assertGameOutcome(
      result,
      mockPlayerOne.username,
      mockPlayerTwo.username,
      GameOutcomes.LOSE,
      GameOutcomes.WIN
    );
  });

  test(`player one chooses scissors, player two chooses paper, 
        player one should win, player two should lose`, () => {
    mockPlayerOne.move = PlayerMoves.SCISSORS;
    mockPlayerTwo.move = PlayerMoves.PAPER;

    const result = service.getMatchDecision(mockSession);

    assertGameOutcome(
      result,
      mockPlayerOne.username,
      mockPlayerTwo.username,
      GameOutcomes.WIN,
      GameOutcomes.LOSE
    );
  });

  test(`player one chooses paper, player two chooses paper, 
        player one should draw, player two should draw`, () => {
    mockPlayerOne.move = PlayerMoves.PAPER;
    mockPlayerTwo.move = PlayerMoves.PAPER;

    const result = service.getMatchDecision(mockSession);

    assertGameOutcome(
      result,
      mockPlayerOne.username,
      mockPlayerTwo.username,
      GameOutcomes.DRAW,
      GameOutcomes.DRAW
    );
  });
  test(`player one chooses rock, player two chooses rock, 
        player one should draw, player two should draw`, () => {
    mockPlayerOne.move = PlayerMoves.ROCK;
    mockPlayerTwo.move = PlayerMoves.ROCK;

    const result = service.getMatchDecision(mockSession);

    assertGameOutcome(
      result,
      mockPlayerOne.username,
      mockPlayerTwo.username,
      GameOutcomes.DRAW,
      GameOutcomes.DRAW
    );
  });
  test(`player one chooses scissors, player two chooses scissors, 
        player one should draw, player two should draw`, () => {
    mockPlayerOne.move = PlayerMoves.SCISSORS;
    mockPlayerTwo.move = PlayerMoves.SCISSORS;

    const result = service.getMatchDecision(mockSession);

    assertGameOutcome(
      result,
      mockPlayerOne.username,
      mockPlayerTwo.username,
      GameOutcomes.DRAW,
      GameOutcomes.DRAW
    );
  });

  test(`player one chooses unknown move, player two chooses scissors, 
        DecisionMaker should throw 'InvalidPlayerMoveException'`, () => {
    mockPlayerOne.move = 5;
    mockPlayerTwo.move = PlayerMoves.SCISSORS;

    assert.throws(
      () => {
        service.getMatchDecision(mockSession);
      },
      InvalidPlayerMoveException,
      'invalid player move'
    );
  });
  test(`player one chooses scissors, player two chooses unknown move, 
        DecisionMaker should throw 'InvalidPlayerMoveException'`, () => {
    mockPlayerOne.move = PlayerMoves.SCISSORS;
    mockPlayerTwo.move = 5;

    assert.throws(
      () => {
        service.getMatchDecision(mockSession);
      },
      InvalidPlayerMoveException,
      'invalid player move'
    );
  });
  test(`player one chooses unknown move, player two chooses unknown move, 
        DecisionMaker should throw 'InvalidPlayerMoveException'`, () => {
    mockPlayerOne.move = -5;
    mockPlayerTwo.move = 5;

    assert.throws(
      () => {
        service.getMatchDecision(mockSession);
      },
      InvalidPlayerMoveException,
      'invalid player move'
    );
  });
});
function assertGameOutcome(
  gameResult: any,
  playerOneUsername: string,
  playerTwoUsername: string,
  expectedPlayerOneOutcome: GameOutcomes,
  expectedPlayerTwoOutcome: GameOutcomes
) {
  assert.isNotNull(gameResult, 'game result is null');
  assert.equal(
    gameResult[playerOneUsername],
    expectedPlayerOneOutcome,
    'player outcome for player one not expected'
  );
  assert.equal(
    gameResult[playerTwoUsername],
    expectedPlayerTwoOutcome,
    'player outcome for player one not expected'
  );
}
