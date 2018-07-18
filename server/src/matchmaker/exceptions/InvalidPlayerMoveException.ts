export class InvalidPlayerMoveException extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidPlayerMoveException.prototype);
  }
}
