import flash, { FlashOption, getFlashMessages } from '@app/index';
import { Request, Response } from 'express';

describe('flash', () => {
  const onAddFlash = jest.fn();
  const onConsumeFlash = jest.fn();

  const req = { session: {} } as Request;
  const res = {} as Response;
  const sessionKeyName = 'express-flash-message';
  res.render = jest.fn();

  const flashOption: FlashOption = {
    sessionKeyName,
    onAddFlash,
    onConsumeFlash,
  };

  const next = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should consume the event key', async () => {
    const flashEvent = 'info';
    const flashMsg = 'Flash Message!';

    flash(flashOption)(req, res, next);
    res.flash(flashEvent, flashMsg);
    const messages = getFlashMessages(
      req,
      sessionKeyName,
      flashEvent,
      onConsumeFlash
    );
    expect(messages.length).toBe(1);
    expect(messages).toContain(flashMsg);
    expect(onConsumeFlash).toHaveBeenCalled();
    expect(
      getFlashMessages(req, sessionKeyName, flashEvent, onConsumeFlash).length
    ).toBe(0);
  });

  it('should consume several flash message at the same time when store several flash in the same event key', async () => {
    const flashEvent = 'info';
    const flashMsg1 = 'Flash Message1!';
    const flashMsg2 = 'Flash Message2!';

    flash(flashOption)(req, res, next);
    res.flash(flashEvent, flashMsg1);
    res.flash(flashEvent, flashMsg2);
    const messages = getFlashMessages(
      req,
      sessionKeyName,
      flashEvent,
      onConsumeFlash
    );
    expect(messages.length).toBe(2);
    expect(messages).toContain(flashMsg1);
    expect(messages).toContain(flashMsg2);
    expect(
      getFlashMessages(req, sessionKeyName, flashEvent, onConsumeFlash).length
    ).toBe(0);
  });

  it('should only consume the responding event key and keep the other key message', async () => {
    const flashEvent1 = 'event1';
    const flashMsg1 = 'Event1 Message';
    const flashEvent2 = 'event2';
    const flashMsg2 = 'Event2 Message';

    flash(flashOption)(req, res, next);
    res.flash(flashEvent1, flashMsg1);
    res.flash(flashEvent2, flashMsg2);

    let messages = getFlashMessages(
      req,
      sessionKeyName,
      flashEvent1,
      onConsumeFlash
    );
    expect(messages).toContain(flashMsg1);
    expect(messages.length).toBe(1);
    expect(
      getFlashMessages(req, sessionKeyName, flashEvent1, onConsumeFlash).length
    ).toBe(0);

    messages = getFlashMessages(
      req,
      sessionKeyName,
      flashEvent2,
      onConsumeFlash
    );
    expect(messages).toContain(flashMsg2);
    expect(messages.length).toBe(1);
    expect(
      getFlashMessages(req, sessionKeyName, flashEvent2, onConsumeFlash).length
    ).toBe(0);
  });
});
