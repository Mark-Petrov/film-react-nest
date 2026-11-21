import { JsonLogger } from './json.logger';

describe('JsonLogger форматирует запись и пишет её в консоль', () => {
  const logger = new JsonLogger();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('собирает level, message и optionalParams в JSON', () => {
    expect(logger.formatMessage('log', 'started', ['App'])).toBe(
      JSON.stringify({
        level: 'log',
        message: 'started',
        optionalParams: ['App'],
      }),
    );
  });

  it('log пишет JSON в console.log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    logger.log('hello', 'Films');
    expect(spy).toHaveBeenCalledWith(
      logger.formatMessage('log', 'hello', ['Films']),
    );
  });

  it('error пишет JSON в console.error', () => {
    const spy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    logger.error('failed', 'stack');
    expect(spy).toHaveBeenCalledWith(
      logger.formatMessage('error', 'failed', ['stack']),
    );
  });
});
