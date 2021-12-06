import { NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';
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

export const downloadFile = async (filePath: string, response: Response) => {
  const fullFilePath = join(process.cwd(), filePath);
  try {
    // tslint:disable-next-line:no-bitwise
    await promisify(fs.access)(
      fullFilePath,
      fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK,
    );
  } catch {
    throw new NotFoundException();
  }

  await new Promise<void>((resolve, reject) => {
    response.sendFile(fullFilePath, (err: any) => {
      if (err) reject();
      resolve();
    });
  });

  return response;
};
