import flash, { FlashOption, getFlashMessages } from '@app/index';
import { Request, Response } from 'express';

describe('flash', () => {
  const onAddFlash = jest.fn();
  const onConsumeFlash = jest.fn();

  const req = {} as Request;
  const res = {} as Response;
  res.render = jest.fn();

  const flashOption: FlashOption = {
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
    const messages = getFlashMessages(flashEvent, onConsumeFlash);
    expect(messages.length).toBe(1);
    expect(messages).toContain(flashMsg);
    expect(onConsumeFlash).toHaveBeenCalled();
    expect(getFlashMessages(flashEvent).length).toBe(0);
  });

  it('should consume several flash message at the same time when store several flash in the same event key', async () => {
    const flashEvent = 'info';
    const flashMsg1 = 'Flash Message1!';
    const flashMsg2 = 'Flash Message2!';

    flash(flashOption)(req, res, next);
    res.flash(flashEvent, flashMsg1);
    res.flash(flashEvent, flashMsg2);
    const messages = getFlashMessages(flashEvent, onConsumeFlash);
    expect(messages.length).toBe(2);
    expect(messages).toContain(flashMsg1);
    expect(messages).toContain(flashMsg2);
    expect(getFlashMessages(flashEvent).length).toBe(0);
  });

  it('should only consume the responding event key and keep the other key message', async () => {
    const flashEvent1 = 'event1';
    const flashMsg1 = 'Event1 Message';
    const flashEvent2 = 'event2';
    const flashMsg2 = 'Event2 Message';

    flash(flashOption)(req, res, next);
    res.flash(flashEvent1, flashMsg1);
    res.flash(flashEvent2, flashMsg2);

    let messages = getFlashMessages(flashEvent1);
    expect(messages).toContain(flashMsg1);
    expect(messages.length).toBe(1);
    expect(getFlashMessages(flashEvent1).length).toBe(0);

    messages = getFlashMessages(flashEvent2);
    expect(messages).toContain(flashMsg2);
    expect(messages.length).toBe(1);
    expect(getFlashMessages(flashEvent2).length).toBe(0);
  });
});
