import { HttpException } from "./root.js";

export class BadRequestException extends HttpException {
  constructor(message, errorCode) {
    super(message, 400, null, errorCode);
  }
}
