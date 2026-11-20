import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  const logger = new TskvLogger();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formats a flat tab-separated record', () => {
    expect(logger.formatMessage('log', 'started', ['App'])).toBe(
      'level=log\tmessage=started\tparam0=App\n',
    );
  });

  it('escapes tabs and line breaks inside values', () => {
    expect(logger.formatMessage('warn', 'a\tb\nc')).toBe(
      'level=warn\tmessage=a\\tb\\nc\n',
    );
  });

  it('writes the record to stdout', () => {
    const spy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
    logger.log('hello');
    expect(spy).toHaveBeenCalledWith('level=log\tmessage=hello\n');
  });
});
