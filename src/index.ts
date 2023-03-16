/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Response {
      flash: (type: string, message: string) => void;
    }
  }
}

type OnConsumeFlash = (type: string, messages: string[]) => void;
type onAddFlash = (type: string, message: string) => void;

export interface FlashOption {
  sessionKeyName: string;
  onAddFlash?: onAddFlash;
  onConsumeFlash?: OnConsumeFlash;
}

export const getFlashMessages = (
  req: Request,
  sessionKeyName: string,
  type: string,
  onConsumeFlash?: OnConsumeFlash
) => {
  if (
    req.session[sessionKeyName] === undefined ||
    req.session[sessionKeyName][type] === undefined
  ) {
    onConsumeFlash?.(type, []);
    return [];
  }
  const flashMessages = req.session[sessionKeyName][type];
  req.session[sessionKeyName];
  delete req.session[sessionKeyName][type];
  onConsumeFlash?.(type, flashMessages);
  return flashMessages;
};

const expressFlashMessage = (option: FlashOption) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { onAddFlash, onConsumeFlash, sessionKeyName } = option;
    if (sessionKeyName === undefined) {
      throw new Error(
        'You must provide a session key name for express flash messages'
      );
    }

    if (req.session === undefined) {
      throw new Error(
        'Request cannot find session, please make sure you install express-session or cookie-session first'
      );
    }

    res.flash = (type: string, message: string) => {
      if (req.session[sessionKeyName] === undefined) {
        req.session[sessionKeyName] = {};
      }

      if (req.session[sessionKeyName][type] === undefined) {
        req.session[sessionKeyName][type] = [];
      }
      req.session[sessionKeyName][type].push(message);
      onAddFlash?.(type, message);
    };

    const originalRender = res.render.bind(res);
    res.render = function (
      view: string,
      data?: object,
      callback?: (err: Error, html: string) => void
    ) {
      originalRender(
        view,
        {
          ...data,
          getFlashMessages: (type: string) =>
            getFlashMessages(req, sessionKeyName, type, onConsumeFlash),
        },
        callback
      );
    };

    await next();
  };
};
export default expressFlashMessage;
