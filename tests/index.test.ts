import { flash, FlashOption } from '../src/index';
import { Request, Response } from 'express';

describe('flash', () => {
  const flashOption: FlashOption = {
    sessionKeyName: 'session',
    useCookieSession: true,
  };

  const next = jest.fn();
  const res = {} as Response;

  it('should return error if request does not have session', () => {
    const req = {} as Request;
    expect(() => flash(flashOption)(req, res, next)).toThrow('no session detected!');
  });

  it('should consume the event key', async () => {
    const req = { session: {} } as Request;
    const flashEvent = 'info';
    const flashMsg = 'Flash Message!';

    flash(flashOption)(req, res, next);
    await req.flash(flashEvent, flashMsg);
    const consumeMessage = await req.consumeFlash(flashEvent);
    expect(consumeMessage).toContain(flashMsg);
  });

  it('should consume several flash message at the same time when store several flash in the same event key', async () => {
    const req = { session: {} } as Request;
    const flashEvent = 'info';
    const flashMsg1 = 'Flash Message1!';
    const flashMsg2 = 'Flash Message2!';

    flash(flashOption)(req, res, next);
    await req.flash(flashEvent, flashMsg1);
    await req.flash(flashEvent, flashMsg2);
    const consumeMessage = await req.consumeFlash(flashEvent);
    expect(consumeMessage).toContain(flashMsg1);
    expect(consumeMessage).toContain(flashMsg2);
  });

  it('should only consume the responding event key and keep the other key message', async () => {
    const req = { session: {} } as Request;
    const flashEvent1 = 'event1';
    const flashMsg1 = 'Event1 Message!';
    const flashEvent2 = 'event2';
    const flashMsg2 = 'Event2 Message!';

    flash(flashOption)(req, res, next);
    await req.flash(flashEvent1, flashMsg1);
    await req.flash(flashEvent2, flashMsg2);

    const consumeMessage = await req.consumeFlash(flashEvent1);
    expect(consumeMessage).toContain(flashMsg1);
    expect(req.session[flashOption.sessionKeyName!][flashEvent1]).toBeUndefined();
    expect(req.session[flashOption.sessionKeyName!][flashEvent2]).toContain(flashMsg2);
  });
});
