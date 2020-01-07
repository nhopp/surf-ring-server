import * as express from 'express';
import * as HttpStatus from 'http-status-codes';

export class AdminAuthorizer {
  private static authRegex = /Bearer (.*)/;
  private readonly token: string;
  constructor(token: string) {
    this.token = token;

    this.middleware.bind(this);
  }
  public middleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const authBearer = req.headers.authorization;
    if (!authBearer) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }

    const authHeader = req.headers.authorization;
    if (authHeader) {
      const authMatch = authHeader.match(AdminAuthorizer.authRegex);
      if (authMatch && authMatch.length === 2 && authMatch[1] === this.token) {
        next();
        return;
      }
    }

    res.sendStatus(HttpStatus.UNAUTHORIZED);
  }
}
