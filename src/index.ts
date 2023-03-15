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
  onAddFlash?: onAddFlash;
  onConsumeFlash?: OnConsumeFlash;
}

const flashCache = new Map<string, string[]>();

export const getFlashMessages = (
  type: string,
  onConsumeFlash?: OnConsumeFlash
) => {
  const flashMessages = flashCache.get(type) || [];
  onConsumeFlash?.(type, flashMessages);
  flashCache.delete(type);
  return flashMessages;
};

const expressFlashMessage = (option: FlashOption = {}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { onAddFlash, onConsumeFlash } = option;
    res.flash = (type: string, message: string) => {
      if (!flashCache.has(type)) {
        flashCache.set(type, []);
      }
      flashCache.get(type)?.push(message);
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
            getFlashMessages(type, onConsumeFlash),
        },
        callback
      );
    };

    await next();
  };
};
export default expressFlashMessage;
