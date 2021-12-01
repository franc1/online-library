import { Request } from 'express';
import { RoleEnum } from 'src/models/role.model';

export class Token {
  constructor(
    public id: number,
    public role: RoleEnum,
    public isStudent: boolean,
  ) {}
}

export interface RequestWithToken extends Request {
  user: Token;
}
