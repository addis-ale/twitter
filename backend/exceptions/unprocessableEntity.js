import { HttpException } from "./root.js";

export class UnprocessableEntity extends HttpException {
  constructor(message, error, errorCode) {
    super(message, 422, error, errorCode);
  }
}
