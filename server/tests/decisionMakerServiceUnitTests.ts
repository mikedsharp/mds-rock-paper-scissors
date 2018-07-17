import { expect } from 'chai';
import { assert } from 'chai';
import 'mocha';
import { DecisionMakerService } from '../src/matchmaker/services/DecisionMakerService';
import { GameSession } from '../src/matchmaker/models/GameSession';
import { Player } from '../src/matchmaker/models/Player';
import { PlayerMoves } from '../src/matchmaker/models/PlayerMoves';
import { GameOutcomes } from '../src/matchmaker/models/GameOutcomes';

let service: DecisionMakerService;
let mockPlayerOne: Player;
let mockPlayerTwo: Player;
let mockSession: GameSession;

suite.only('DecisionMakerService.getMatchDecision()', () => {
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
  test(`player one chooses paper, player two chooses paper, 
        player one should draw, player one should draw`, () => {
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
