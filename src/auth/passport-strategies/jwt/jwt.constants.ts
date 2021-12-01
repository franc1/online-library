import * as config from 'config';

export const jwtConstants = {
  secret: config.get<string>('jwtPrivateKey'),
};
