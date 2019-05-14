import { Request, Response, NextFunction } from 'express';

interface FlashOption {
  sessionKeyName?: string;
}

declare global {
  namespace Express {
    interface Request {
      flash: (event: string, message: string) => Promise<void>;
      consumeFlash: (event: string) => Promise<string[]>;
    }
  }
}

export const flash = (options?: FlashOption) => (req: Request, response: Response, next: NextFunction) => {
  if (!req.session) {
    throw new Error('no session detected!');
  }

  const keyName = options ? (options.sessionKeyName ? options.sessionKeyName : 'flash') : 'flash';

  req.flash = (event, message) => {
    return new Promise((res, rej) => {
      if (!req.session![keyName]) {
        req.session![keyName] = {};
      }
      if (!req.session![keyName][event]) {
        req.session![keyName][event] = [];
      }
      req.session![keyName][event].push(message);
      req.session!.save(err => {
        if (err) {
          return rej(err);
        }
        res();
      });
    });
  };

  req.consumeFlash = event => {
    return new Promise((res, rej) => {
      let messages: string[] = [];
      if (req.session![keyName] && req.session![keyName][event]) {
        messages = [...req.session![keyName][event]];
        req.session![keyName] = null;
      }
      req.session!.save(err => {
        if (err) {
          return rej(err);
        }
        res(messages);
      });
    });
  };

  next();
};
