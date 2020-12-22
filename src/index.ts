declare global {
  namespace Express {
    interface Request {
      flash: (event: string, message: string) => Promise<void>;
      consumeFlash: (event: string) => Promise<string[]>;
    }
  }
}

import { Request, Response, NextFunction } from 'express';

export interface FlashOption {
  sessionKeyName?: string;
  useCookieSession?: boolean;
}

export const flash = (options: FlashOption = { sessionKeyName: 'flash' }) => (
  req: Request,
  response: Response,
  next: NextFunction
) => {
  if (!req.session) {
    throw new Error('no session detected!');
  }

  const { sessionKeyName, useCookieSession } = options;

  const keyName = sessionKeyName ?? 'flash';

  req.flash = (event, message) => {
    return new Promise((res, rej) => {
      if (!req.session[keyName]) {
        req.session[keyName] = {};
      }
      if (!req.session[keyName][event]) {
        req.session[keyName][event] = [];
      }
      req.session[keyName][event].push(message);

      if (useCookieSession) {
        res();
        return;
      }

      // for express-session
      req.session.save((err) => {
        if (err) {
          return rej(err);
        }
        res();
      });
    });
  };

  req.consumeFlash = (event) => {
    return new Promise((res, rej) => {
      let messages: string[] = [];
      if (req.session[keyName] && req.session[keyName][event]) {
        messages = [...req.session[keyName][event]];
        req.session![keyName] = null;
      }

      if (useCookieSession) {
        res(messages);
        return;
      }

      // for express-session
      req.session.save((err) => {
        if (err) {
          return rej(err);
        }
        res(messages);
      });
    });
  };

  next();
};
