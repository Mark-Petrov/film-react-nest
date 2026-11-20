import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  const logger = new JsonLogger();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formats a record as json', () => {
    expect(logger.formatMessage('log', 'started', ['App'])).toBe(
      JSON.stringify({
        level: 'log',
        message: 'started',
        optionalParams: ['App'],
      }),
    );
  });

  it('writes log records to stdout', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    logger.log('hello', 'Films');
    expect(spy).toHaveBeenCalledWith(
      logger.formatMessage('log', 'hello', ['Films']),
    );
  });

  it('writes errors to stderr', () => {
    const spy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    logger.error('failed', 'stack');
    expect(spy).toHaveBeenCalledWith(
      logger.formatMessage('error', 'failed', ['stack']),
    );
  });
});
