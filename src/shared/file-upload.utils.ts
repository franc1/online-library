import * as crypto from 'crypto';
import { promisify } from 'util';

import { ApiError } from './api-error';
import { ErrorCodes } from './error-codes';

export const imageFileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: any,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new ApiError(400, ErrorCodes.ONLY_IMAGES_ALLOWED), false);
  }
  callback(null, true);
};

export const editFileName = async (
  req: any,
  file: Express.Multer.File,
  callback: any,
) => {
  const unique = (await promisify(crypto.randomBytes)(2))
    .toString('hex')
    .toUpperCase();
  const newFileName = `${Date.now()}_${unique}_${file.originalname}`;
  callback(null, newFileName);
};
