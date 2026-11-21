import { TskvLogger } from './tskv.logger';

describe('TskvLogger форматирует TSKV и пишет запись в stdout', () => {
  const logger = new TskvLogger();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('склеивает поля через таб и добавляет перевод строки', () => {
    expect(logger.formatMessage('log', 'started', ['App'])).toBe(
      'level=log\tmessage=started\tparam0=App\n',
    );
  });

  it('экранирует таб и перевод строки внутри значений', () => {
    expect(logger.formatMessage('warn', 'a\tb\nc')).toBe(
      'level=warn\tmessage=a\\tb\\nc\n',
    );
  });

  it('log пишет строку TSKV в stdout', () => {
    const spy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
    logger.log('hello');
    expect(spy).toHaveBeenCalledWith('level=log\tmessage=hello\n');
  });
});
