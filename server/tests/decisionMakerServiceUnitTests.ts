import { expect } from "chai";
import { assert } from "chai";
import "mocha";
import { DecisionMakerService } from "../src/matchmaker/services/DecisionMakerService";
import { GameSession } from "../src/matchmaker/models/GameSession";
import { Player } from "../src/matchmaker/models/Player";
import { PlayerMoves } from "../src/matchmaker/models/PlayerMoves";
import { GameOutcomes } from "../src/matchmaker/models/GameOutcomes";

suite.only("DecisionMakerService.getMatchDecision()", () => {
  test("Should return a match decision, player one loses player two wins", () => {
    const service = new DecisionMakerService();
    const mockPlayerOne = new Player("player1", "player-1-socket-id");
    const mockPlayerTwo = new Player("player2", "player-2-socket-id");
    const mockSession = new GameSession(mockPlayerOne, mockPlayerTwo);

    mockPlayerOne.move = PlayerMoves.ROCK;
    mockPlayerTwo.move = PlayerMoves.PAPER;

    const result = service.getMatchDecision(mockSession);

    assert.isNotNull(result);
    assert.equal(result[mockPlayerOne.username], GameOutcomes.LOSE);
    assert.equal(result[mockPlayerTwo.username], GameOutcomes.WIN);
  });
});
